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

export interface IFlightPriceTrackingService {
    searchFlights: (subscription: FlightPriceSubscription) => Promise<FlightDto[]>;
    searchLocations: (searchTerm: string) => Promise<LocationDto[]>;
    subscribe: (phoneNumber: string, searchForm: FlightSearchForm) => Promise<void>;
    unsubscribe: (phoneNumber: string, subscriptionId: number) => Promise<void>;
    dispatchPriceTrackers: () => Promise<void>;
}

export class FlightPriceTrackingServiceImpl implements IFlightPriceTrackingService {
    private readonly Context: IFlightMeContext;
    private readonly FlightApi: IFlightApiService;
    private readonly SmsService: ISmsService;
    private readonly UrlShortener: IUrlShortenerService;

    constructor(context: IFlightMeContext, smsService: ISmsService, flightApi: IFlightApiService, urlShortener: IUrlShortenerService) {
        this.Context = context;
        this.SmsService = smsService;
        this.FlightApi = flightApi;
        this.UrlShortener = urlShortener;
    }

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

    async unsubscribe(phoneNumber: string, subscriptionId: number): Promise<void> {
        await this.Context.initialize();
        const existingSubscription = await this.Context.phoneSubscriptions()
            .getByPhoneNumber(phoneNumber);

        if (!existingSubscription) return;

        existingSubscription.subscriptions = existingSubscription.subscriptions
            .filter(x => x.id != subscriptionId);

        if (existingSubscription.subscriptions.length === 0) {
            await this.Context.phoneSubscriptions()
                .delete(existingSubscription.id);
        } else {
            await this.Context.phoneSubscriptions()
                .replace(existingSubscription);
        }
    };

    private async updateSubscription(existingSubscription: CosmosEntity<PhoneSubscription>, subscription: FlightPriceSubscription) {
        existingSubscription.subscriptions
            .push(subscription);
        await this.Context.phoneSubscriptions()
            .replace(existingSubscription);
    }

    private async createSubscription(phoneNumber: string, subscription: FlightPriceSubscription) {
        const phoneSubscription: PhoneSubscription = {
            phoneNumber: phoneNumber,
            subscriptions: [subscription]
        };

        await this.Context.phoneSubscriptions()
            .create(phoneSubscription);
    }

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

    async dispatchPriceTrackers(): Promise<void> {
        await this.Context.initialize();
        const phoneSubscriptions = await this.Context.phoneSubscriptions().getAll();
        for (const phoneSubscription of phoneSubscriptions) {
            await this.trackPrice(phoneSubscription);
        }
    }

    private async trackPrice(phoneSubscription: PhoneSubscription): Promise<void> {
        for (const subscription of phoneSubscription.subscriptions) {
            const flights = await this.searchFlights(subscription);
            if (!flights || flights.length === 0) return;
            await this.sendFlightNotifications(phoneSubscription.phoneNumber, subscription, flights);
        }
    }

    async sendFlightNotifications(phoneNumber: string, subscription: FlightPriceSubscription, flights: FlightDto[], flightsToSend: number = 3) {
        const linksToSend = await this.getShortenedFlightLinks(flights, flightsToSend);
        const message = `Heyo, Flight.Me here!
            \nWe found some flights for ${subscription.fly_from} to ${subscription.fly_to} with dates
            Departure: ${subscription.date_from}
            Return: ${subscription.return_from}.

            \nCheck them out!
            ${linksToSend.join('\n\n')}
            `;
        await this.SmsService.sendMessage(phoneNumber, message)
    }

    private async getShortenedFlightLinks(flights: FlightDto[], linksToShorten: number): Promise<string[]> {
        const shortenedLinks: string[] = [];
        for (const { deepLink } of flights.slice(0, linksToShorten)) {
            const link = await this.UrlShortener.shorten(deepLink);
            shortenedLinks.push(link)
        }
        return shortenedLinks;
    }
}

export const FlightPriceTrackingService: IFlightPriceTrackingService = new FlightPriceTrackingServiceImpl(FlightMeContext, SmsService, FlightApi, UrlShortenerService);