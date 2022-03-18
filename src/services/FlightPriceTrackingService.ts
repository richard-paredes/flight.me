import { FlightDto } from "../pages/api/flights";
import { LocationDto } from "../pages/api/locations";
import { CosmosEntity } from "../types/CosmosEntity";
import { FlightPriceSubscription } from "../types/FlightPriceTracking/FlightPriceSubscription";
import { PhoneSubscription } from "../types/FlightPriceTracking/PhoneSubscription";

import { FlightMeContext, IFlightMeContext } from "./FlightMeContext";
import { FlightApi, IFlightApiService } from "./FlightApiService";
import { SmsService, ISmsService } from "./SmsService";
import { FlightSearchForm } from "../types/FlightSearch";
import { IUrlShortenerService, UrlShortenerService } from "./UrlShortenerService";
import { ApiUtilityService, IApiUtilityService } from "./ApiUtilityService";

export interface IFlightPriceTrackingService {
    searchFlights: (subscription: FlightPriceSubscription) => Promise<FlightDto[]>;
    searchLocations: (searchTerm: string) => Promise<LocationDto[]>;
    subscribe: (phoneNumber: string, searchForm: FlightSearchForm) => Promise<void>;
    unsubscribe: (phoneNumber: string, subscriptionId: number) => Promise<void>;
    dispatchPriceTrackers: () => Promise<void>;
}

/**
 * Service containing logic for allowing users to subscribe to
 * flight price alerts.
 */
export class FlightPriceTrackingServiceImpl implements IFlightPriceTrackingService {
    private readonly Context: IFlightMeContext;
    private readonly FlightApi: IFlightApiService;
    private readonly SmsService: ISmsService;
    private readonly UrlShortener: IUrlShortenerService;
    private readonly ApiUtility: IApiUtilityService;

    constructor(context: IFlightMeContext, 
        smsService: ISmsService, 
        flightApi: IFlightApiService, 
        urlShortener: IUrlShortenerService,
        apiUtility: IApiUtilityService
    ) {
        this.Context = context;
        this.SmsService = smsService;
        this.FlightApi = flightApi;
        this.UrlShortener = urlShortener;
        this.ApiUtility = apiUtility;
    }

    /**
     * Subscribes a user to receive alerts whenever the flight API responses satisfies the search form conditions
     * @param phoneNumber Phone number used to notify the user
     * @param searchForm Snapshot of the form used to query the API when enacting the subscription
     */
    async subscribe(phoneNumber: string, searchForm: FlightSearchForm): Promise<void> {
        await this.Context.initialize();
        const existingSubscription = await this.Context.phoneSubscriptions()
            .getByPhoneNumber(phoneNumber);

        if (existingSubscription) {
            await this.updateSubscription(existingSubscription, { ...searchForm, id: existingSubscription.subscriptions.length });
        } else {
            await this.createSubscription(phoneNumber, { ...searchForm, id: 0 });
        }
    }

    /**
     * Removes an existing subscription on a user
     * @param phoneNumber Phone number used to notify the user
     * @param subscriptionId The id of the subscription the user has
     * @returns 
     */
    async unsubscribe(phoneNumber: string, subscriptionId: number): Promise<void> {
        await this.Context.initialize();
        const existingSubscription = await this.Context.phoneSubscriptions()
            .getByPhoneNumber(phoneNumber);

        if (!existingSubscription) return;

        existingSubscription.subscriptions = existingSubscription.subscriptions
            .filter(x => x.id != subscriptionId);

        if (existingSubscription.subscriptions.length === 0) {
            await this.Context.phoneSubscriptions()
                .delete(existingSubscription);
        } else {
            await this.Context.phoneSubscriptions()
                .replace(existingSubscription);
        }
    };

    /**
     * Adds a new flight search subscription to an existing PhoneSubscription
     * @param existingSubscription The existing PhoneSubscription
     * @param subscription The flight search parameters to subscribe to
     */
    private async updateSubscription(existingSubscription: CosmosEntity<PhoneSubscription>, subscription: FlightPriceSubscription) {
        existingSubscription.subscriptions
            .push(subscription);
        await this.Context.phoneSubscriptions()
            .replace(existingSubscription);
    }

    /**
     * Creates a new PhoneSubscription, tying the phone number to a price tracking for given flight parameters
     * @param phoneNumber The phone number used to notify the user
     * @param subscription The flight search parameters to subscribe to
     */
    private async createSubscription(phoneNumber: string, subscription: FlightPriceSubscription) {
        const phoneSubscription: PhoneSubscription = {
            phoneNumber: phoneNumber,
            subscriptions: [subscription]
        };

        await this.Context.phoneSubscriptions()
            .create(phoneSubscription);
    }

    /**
     * Queries the flight API using a subscription's flight parameters
     * @param subscription The flight search parameters to subscribe to
     * @returns 
     */
    async searchFlights(subscription: FlightPriceSubscription): Promise<FlightDto[]> {
        const response = await this.FlightApi.searches.search({
            ...subscription,
            date_to: subscription.date_from,
            return_to: subscription.return_from,
            locale: 'en',
            sort: 'price',
            max_stopovers: subscription.non_stop ? 0 : 1
        });

        return response.data.map((x): FlightDto => ({
            id: x.id,
            flyFrom: x.flyFrom,
            flyTo: x.flyTo,
            cityFrom: x.cityFrom,
            cityTo: x.cityTo,
            countryFrom: x.countryFrom?.name,
            countryTo: x.countryTo?.name,
            price: x.price,
            deepLink: x.deep_link
        }));
    }

    /**
     * Queries the flight API to look for flight locations
     * @param searchTerm Searches for different locations a flight can be at
     * @returns List of LocationDto describing potential results
     */
    async searchLocations(searchTerm: string): Promise<LocationDto[]> {
        const response = await this.FlightApi.locations.query({
            term: searchTerm,
            location_types: ['city', 'country', 'airport', 'subdivision'],
            limit: 50,
            active_only: true
        });

        return response.locations.map((x): LocationDto => ({
            id: x.id,
            name: x.name,
            subdivisionName: x.subdivision?.name,
            countryName: x.country?.name || x.city?.country?.name,
            type: x.type
        })
        );
    }

    /**
     * Iterates through all the existing subscriptions in the data store 
     * and starts the user notification process if applicable
     */
    async dispatchPriceTrackers(): Promise<void> {
        await this.Context.initialize();
        const phoneSubscriptions = await this.Context.phoneSubscriptions().getAll();
        for (const phoneSubscription of phoneSubscriptions) {
            await this.trackPrice(phoneSubscription);
        }
    }

    /**
     * Iterates through all the flight search subscriptions tied to a phone number
     * If the API has responses for any of the subscriptions, the user is notified
     * @param phoneSubscription PhoneSubscription used to query the flight API
     * @returns 
     */
    private async trackPrice(phoneSubscription: PhoneSubscription): Promise<void> {
        for (const subscription of phoneSubscription.subscriptions) {
            const flights = await this.searchFlights(subscription);
            if (!flights || flights.length === 0) return;
            await this.sendFlightNotifications(phoneSubscription.phoneNumber, subscription, flights);
        }
    }

    /**
     * Sends a message to the user's phone number about their subscription
     * @param phoneNumber The phone number used to notify the user
     * @param subscription The flight search parameters the user is subscribed to
     * @param flights The flights that satisfy the subscription
     * @param flightsToSend Number of flights to send the user as a preview
     */
    async sendFlightNotifications(phoneNumber: string, subscription: FlightPriceSubscription, flights: FlightDto[], flightsToSend: number = 3) {
        const linksToSend = await this.getShortenedFlightLinks(flights, flightsToSend);
        const unsubscribeLink = await this.getUnsubscriptionLink(phoneNumber, subscription);

        const message = `Heyo, Flight.Me here!
            \nWe found some flights for ${subscription.fly_from} to ${subscription.fly_to} with dates\nDeparture: ${subscription.date_from}\nReturn: ${subscription.return_from}.

            \nCheck them out!\n${linksToSend.join('\n\n')}

            Unsubscribe from this price alert by clicking this link:
            ${unsubscribeLink}
            `;
        
        await this.SmsService.sendMessage(phoneNumber, message)
    }

    /**
     * Generates a link used to unsubscribe the user from a subscription
     * @param phoneNumber The phone number used to notify the user
     * @param subscription The flight search parameters the user is subscribed to
     * @returns A URL the user can use to unsubscribe to a subscription they have
     */
    private async getUnsubscriptionLink(phoneNumber: string, subscription: FlightPriceSubscription): Promise<string> {
        const request = this.ApiUtility.buildGetRequest('/api/unsubscribe', { phone: phoneNumber, sid: subscription.id });
        return process.env.NODE_ENV === 'development' ? request.url : await this.UrlShortener.shorten(request.url);
    }

    /**
     * 
     * @param flights The flights used to generate the shortened links
     * @param linksToShorten The number of shorted links returned 
     * @returns List of links, with length corresponding to `linksToShorten`
     */
    private async getShortenedFlightLinks(flights: FlightDto[], linksToShorten: number): Promise<string[]> {
        const shortenedLinks: string[] = [];
        for (const { deepLink } of flights.slice(0, linksToShorten)) {
            const link = await this.UrlShortener.shorten(deepLink);
            shortenedLinks.push(link)
        }
        return shortenedLinks;
    }
}

export const FlightPriceTrackingService: IFlightPriceTrackingService = new FlightPriceTrackingServiceImpl(
    FlightMeContext, 
    SmsService, 
    FlightApi, 
    UrlShortenerService,
    new ApiUtilityService(process.env.BASE_URL));