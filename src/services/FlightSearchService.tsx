import React from 'react';

import { Airport } from "../pages/api/airports";
import { Stringified } from "../types";
import { DropdownOption } from '../components/AirportDropdownOption';
import { FlightFormValues, TravelClassOption } from "../types/FlightSearch";

interface IFlightSearchService {
    getTravelClasses: () => TravelClassOption[];
    getAirportLabel: (airport: Airport) => React.ReactNode;
    getDefaultFormValues: () => FlightFormValues;
    getFlightFormLabels: () => Stringified<Required<FlightFormValues>>;
    getAirportAsString: (airport: Airport) => string;
    fetchAirports: (search: string) => Promise<Airport[]>;
    submitSearch: (form: FlightFormValues) => Promise<any[]>;
}

class FlightSearchService implements IFlightSearchService {
    searchableFields: (keyof Airport)[] = ['id', 'city', 'country', 'city2', 'state', 'stateShort'];
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
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const defaultValues: FlightFormValues = {
            originLocationCode: '',
            destinationLocationCode: '',
            departureDate: today.toLocaleDateString('en-CA'),
            returnDate: tomorrow.toLocaleDateString('en-CA'),
            travelClass: 'ECONOMY',
            adults: 1,
            children: 0,
            infants: 0,
            nonStop: false,
            currencyCode: 'USD',
            maxPrice: 150,
            max: 10
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
    getAirportLabel = (airport: Airport) => {
        const name = this.getAirportAsString(airport);
        const sublabel = `${airport.name} (${airport.id.toUpperCase()})`;

        return <DropdownOption name={name} sublabel={sublabel} />;
    };
    getAirportAsString = (airport: Airport) => {
        if (airport.state) return `${airport.city}, ${airport.state} (${airport.id.toUpperCase()})`;
        return `${airport.city} - ${airport.country} (${airport.id.toUpperCase()})`;
    };
    filterAirports = (airports: Airport[], input: string) => {
        return airports.filter(airport => this.searchableFields.some(field => airport[field]?.toLowerCase().includes(input.toLowerCase())));
    };
    getAirport = (airports: Airport[], airportId: string) => {
        return airports.find(x => airportId === x.id);
    };
    fetchAirports = async (search: string) => {
        const response = await fetch('/api/airports?search=' + encodeURIComponent(search));
        const data: Airport[] = await response.json();
        return data;
    };
    submitSearch = async (form: FlightFormValues) => {
        const response = await fetch('/api/flights', { method: 'POST', body: JSON.stringify(form) });
        const data: any[] = await response.json();
        return data;
    };
}

export default new FlightSearchService();