export type TravelClass = "M" | "W" | "C" | "F";

export interface TravelClassOption {
    label: string;
    value: TravelClass;
}

export interface FlightFormValues {
    fly_from: string;
    fly_to: string;
    date_from: string;
    return_from: string;
    adults: number;
    children: number;
    infants: number;
    selected_cabins: TravelClass;
    max_stopovers: number;
    curr: string;
    price_to: number;
    limit?: number;
}

