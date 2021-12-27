import { FlightDto } from "../pages/api/flights";
import { LocationDto } from "../pages/api/locations";
import { CosmosEntity } from "../types/CosmosEntity";
import { FlightPriceSubscription } from "../types/FlightPriceTracking/FlightPriceSubscription";
import { PhoneSubscription } from "../types/FlightPriceTracking/PhoneSubscription";

import { FlightMeContext, IFlightMeContext } from "./FlightMeContext";
import { FlightApi, IFlightApi } from "./FlightApi";
import { SmsService, ISmsService } from "./SmsService";

export interface IFlightPriceTrackingService {
    searchFlights: (subscription: FlightPriceSubscription) => Promise<FlightDto[]>;
    searchLocations: (searchTerm: string) => Promise<LocationDto[]>;
    upsertPhoneSubscription: (phoneNumber: string, subscription: FlightPriceSubscription) => Promise<void>;
    dispatchPriceTrackers: () => Promise<void>;
}

export class FlightPriceTrackingServiceImpl implements IFlightPriceTrackingService {
    private readonly Context: IFlightMeContext;
    private readonly FlightApi: IFlightApi;
    private readonly SmsService: ISmsService;

    constructor(context: IFlightMeContext, smsService: ISmsService, flightApi: IFlightApi) {
        this.Context = context;
        this.SmsService = smsService;
        this.FlightApi = flightApi;
    }

    async upsertPhoneSubscription(phoneNumber: string, subscription: FlightPriceSubscription): Promise<void> {
        await this.Context.initialize();
        const existingSubscription = await this.Context.phoneSubscriptions()
            .getByPhoneNumber(phoneNumber);

        if (existingSubscription) {
            await this.updateSubscription(existingSubscription, subscription);
        } else {
            await this.createSubscription(phoneNumber, subscription);
        }
    }

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
            max_stopovers: subscription.non_stop && 0
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
        const response = await FlightApi.locations.query({
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
        phoneSubscriptions.forEach(this.trackPrice)
    }

    private async trackPrice(phoneSubscription: PhoneSubscription): Promise<void> {
        phoneSubscription.subscriptions
            .forEach(async subscription => {
                const flights = await this.searchFlights(subscription);
                if (!flights || flights.length === 0) return;
                await this.sendFlightNotifications(phoneSubscription.phoneNumber, subscription, flights);
            });
    }

    async sendFlightNotifications(phoneNumber: string, subscription: FlightPriceSubscription, flights: FlightDto[], flightsToSend: number = 3) {
        const linksToSend = flights.splice(0, flightsToSend).map(x => x.deepLink);
        const message = `Heyo, Flight.Me here!
            \nWe found some flights for ${subscription.fly_from} to ${subscription.fly_to} 
            on dates DEPARTURE: ${subscription.date_from} RETURN: ${subscription.return_from}.

            \n\nCheck them out!
            ${linksToSend.join('\n\n')}
            `;
        await this.SmsService.sendMessage(phoneNumber, message)
    }
}

export const FlightPriceTrackingService: IFlightPriceTrackingService = new FlightPriceTrackingServiceImpl(FlightMeContext, SmsService, FlightApi);


