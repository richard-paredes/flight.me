import { Airport } from "../pages/api/airports";
import { Stringified } from "../types";
import { FlightFormValues, TravelClassOption } from "../types/FlightSearch";

interface IFlightSearchService {
    getTravelClasses: () => TravelClassOption[];
    getAirportLabel: (airport: Airport) => string;
    getDefaultFormValues: () => FlightFormValues;
    getFlightFormLabels: () => Stringified<Required<FlightFormValues>>;
    fetchAirports: () => Promise<Airport[]>;
}

class FlightSearchService implements IFlightSearchService {
    getTravelClasses = () => {
        return [{
            label: "Economy",
            value: "ECONOMY"
        },
        {
            label: "Premium Economy",
            value: "PREMIUM_ECONOMY"
        },
        {
            label: "Business",
            value: "BUSINESS"
        },
        {
            label: "First",
            value: "FIRST"
        }] as TravelClassOption[];
    };
    getDefaultFormValues = () => {
        const today = new Date();
        const defaultValues: FlightFormValues = {
            originLocationCode: '',
            destinationLocationCode: '',
            departureDate: new Date(today),
            returnDate: new Date(today.getDate() + 1),
            travelClass: 'ECONOMY',
            adults: 1,
            children: 0,
            infants: 0,
            nonStop: false,
            currencyCode: 'USD',
            maxPrice: 150
        };
        return defaultValues;
    };
    getFlightFormLabels = () => {
        const flightFormLabels: Stringified<Required<FlightFormValues>> = {
            originLocationCode: "Origin",
            destinationLocationCode: "Destination",
            departureDate: "Departure",
            returnDate: "Return",
            adults: "Adults",
            children: "Children",
            infants: "Infants",
            travelClass: "Travel Class",
            includedAirlineCodes: undefined,
            excludedAirlineCodes: undefined,
            nonStop: "Non-stop",
            currencyCode: "Currency",
            maxPrice: "Max Price",
            max: undefined
        }
        return flightFormLabels;
    };
    fetchAirports = async () => {
        const response = await fetch('/api/airports');
        const data: Airport[] = await response.json();
        return data;
    };
    getAirportLabel = (airport: Airport) => {
        if (airport.state) return `${airport.city}, ${airport.state} - ${airport.country} | ${airport.id.toUpperCase()}`;
        return `${airport.city} - ${airport.country} | ${airport.id.toUpperCase()}`;
    };
    filterAirports = (airports: Airport[], input: string) => {
        return airports.filter(x => this.getAirportLabel(x).toLowerCase().includes(input.toLowerCase()));
    };
    getAirport = (airports: Airport[], airportId: string) => {
        return airports.find(x => airportId === x.id);
    };
}

export default new FlightSearchService();