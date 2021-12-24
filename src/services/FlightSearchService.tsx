import React from 'react';

import { LocationDto } from "../pages/api/airports";
import { Stringified } from "../types";
import { DropdownOption } from '../components/AirportDropdownOption';
import { FlightFormValues, TravelClassOption } from "../types/FlightSearch";

interface IFlightSearchService {
    getTravelClasses: () => TravelClassOption[];
    locationToLabel: (airport: LocationDto) => React.ReactNode;
    getDefaultFormValues: () => FlightFormValues;
    getFlightFormLabels: () => Stringified<Required<FlightFormValues>>;
    locationToString: (airport: LocationDto) => string;
    fetchLocations: (search: string) => Promise<LocationDto[]>;
    submitSearch: (form: FlightFormValues) => Promise<any[]>;
}

class FlightSearchService implements IFlightSearchService {
    searchableFields: (keyof LocationDto)[] = ['id'];
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
    locationToLabel = (location: LocationDto) => {
        const name = this.locationToString(location);
        const sublabel = location.stateName ? `${location.stateName}, ${location.countryName}` 
            : location.countryName;

        return <DropdownOption name={name} sublabel={sublabel} />;
    };
    locationToString = (location: LocationDto) => {
        return location.name;
    };
    fetchLocations = async (search: string) => {
        if (!search) return [];

        const response = await fetch('/api/airports?search=' + encodeURIComponent(search));
        const data: LocationDto[] = await response.json();
        return data;
    };
    submitSearch = async (form: FlightFormValues) => {
        const response = await fetch('/api/flights', { method: 'POST', body: JSON.stringify(form) });
        const data: any[] = await response.json();
        return data;
    };
}

export default new FlightSearchService();