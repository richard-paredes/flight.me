export type SearchQuery = {
    fly_from: string;
    fly_to?: string;
    date_from: string;
    date_to: string;
    return_from?: string;
    return_to?: string;
    flight_type?: string;
    one_for_city?: 0 | 1;
    one_per_date?: 0 | 1;
    adults: number;
    children: number;
    infants: number;
    selected_cabins?: string;
    max_with_cabins?: string;
    curr: string;
    locale: string;
    price_from?: number;
    price_to: number;
    max_stopovers?: number;
    sort: "price" | "duration" | "quality" | "date";

}

export type Route = {
    fare_basis: string;
    fare_category: string;
    fare_classes: string;
    fare_family: string;
    last_seen: string;
    refresh_timestamp: string;
    return: number;
    bags_recheck_required: boolean;
    guarantee: boolean;
    id: string;
    combination_id: string;
    cityTo: string;
    cityFrom: string;
    cityCodeFrom: string;
    cityCodeTo: string;
    flyTo: string;
    flyFrom: string;
    airline: string;
    operating_carrier: string;
    equipment: string;
    flight_no: number;
    vehicle_type: string;
    operating_flight_no: string;
    local_arrival: string;
    utc_arrival: string;
    local_departure: string;
    utc_departure: string;
}
export type Search = {
    id: string;
    nightsInDest: number | null,
    duration: {
        departure: number;
        return: number;
        total: number;
    };
    flyFrom: string;
    cityFrom: string;
    cityCodeFrom: string;
    countryFrom: {
        code: string;
        name: string;
    };
    flyTo: string;
    cityTo: string;
    cityCodeTo: string;
    countryTo: {
        code: string;
        name: string;
    },
    distance: number;
    routes: string[];
    airlines: string[];
    pnr_count: number;
    has_airport_change: boolean;
    technical_stops: number;
    throw_away_ticketing: boolean;
    hidden_city_ticketing: boolean;
    price: number;
    bags_price: {
        [key: string]: number;
    };
    baglimit: {
        hand_width: number;
        hand_height: number;
        hand_length: number;
        hand_weight: number;
        hold_width: number;
        hold_height: number;
        hold_length: number;
        hold_dimensions_sum: number;
        hold_weight: number;
    };
    availability: {
        seats: number;
    };
    facilitated_booking_available: boolean;
    conversion: {
        [key: string]: number;
    };
    quality: number;
    booking_token: string;
    deep_link: string;
    transfers: string[],
    type_flights: string[];
    fare: {
        adults: number;
        children: number;
        infants: number;
    };
    price_dropdown: {
        base_fare: number;
        fees: number;
    };
    virtual_interlining: boolean;
    route: Route[];
    local_arrival: string;
    utc_arrival: string;
    local_departure: string;
    utc_departure: string;
}
export type SearchResult = {
    search_id?: string;
    data: Search[],
    connections?: string[],
    time?: number,
    currency?: string;
    currency_rate?: number;
    fx_rate?: number;
    refresh?: string[];
    del?: number;
    ref_tasks?: string[];
    search_params?: object;
    all_stopover_airports?: string[];
    all_airlines?: string[];
}