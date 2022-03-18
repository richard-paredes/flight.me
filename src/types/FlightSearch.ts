import { TravelClasses } from "./FlightPriceTracking/FlightPriceSubscription";

export interface TravelClassOption {
    label: string;
    value: typeof TravelClasses[number];
}

export type FlightFormValues = FlightSearchForm & {
    phone_number: string;
}

/**
 * Query parameters used by the Kiwi flights API
 */
export type FlightSearchForm = {
    fly_from: string;
    fly_to: string;
    date_from: string;
    return_from: string;
    adults: number;
    children: number;
    infants: number;
    selected_cabins: typeof TravelClasses[number];
    non_stop: boolean;
    curr: string;
    price_to: number;
    limit: number;
}