export type TravelClass = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";

export interface TravelClassOption {
    label: string;
    value: TravelClass;
}

export interface FlightFormValues {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: Date;
    returnDate: Date;
    adults: number;
    children?: number;
    infants?: number;
    travelClass: TravelClass;
    includedAirlineCodes?: string[];
    excludedAirlineCodes?: string[];
    nonStop: boolean;
    currencyCode: string;
    maxPrice?: number;
    max?: number;
}

