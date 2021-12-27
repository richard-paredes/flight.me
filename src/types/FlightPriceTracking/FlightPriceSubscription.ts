import { FlightSearchForm } from "../FlightSearch";

export const TravelClasses = ["M", "W", "C", "F", ""];

export type FlightPriceSubscription = FlightSearchForm & {
    id: number;
}