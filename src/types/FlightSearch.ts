export const TravelClasses = ["M", "W", "C", "F", ""];

export interface TravelClassOption {
    label: string;
    value: typeof TravelClasses[number];
}

export interface FlightFormValues {
    phone_number: string;
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

