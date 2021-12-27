import { FlightPriceSubscription } from "./FlightPriceSubscription";

export type PhoneSubscription = {
    phoneNumber: string;
    subscriptions: FlightPriceSubscription[];
};