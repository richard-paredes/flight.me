import { FlightPriceSubscription, TravelClasses } from "./FlightPriceTracking/FlightPriceSubscription";

export interface TravelClassOption {
    label: string;
    value: typeof TravelClasses[number];
}

export interface FlightFormValues extends FlightPriceSubscription{
    phone_number: string;
}

