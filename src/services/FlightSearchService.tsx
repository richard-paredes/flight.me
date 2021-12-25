import React from 'react';

import { Stringified } from "../types";
import { FlightFormValues, TravelClassOption } from "../types/FlightSearch";

import { LocationDto } from "../pages/api/locations";
import { FlightDto } from '../pages/api/flights';

import { DropdownOption } from '../components/DropdownOption';


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
            value: "M"
        },
        {
            label: "Premium Economy",
            value: "W"
        },
        {
            label: "Business",
            value: "C"
        },
        {
            label: "First",
            value: "F"
        },
        {
            label: "Any",
            value: ""        
        }] as TravelClassOption[];
    };
    getDefaultFormValues = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const defaultValues: FlightFormValues = {
            phone_number: '',
            fly_from: '',
            fly_to: '',
            date_from: today.toLocaleDateString('en-CA'),
            return_from: tomorrow.toLocaleDateString('en-CA'),
            selected_cabins: 'M',
            adults: 1,
            children: 0,
            infants: 0,
            non_stop: true,
            curr: 'USD',
            price_to: 150,
            limit: 50
        };
        return defaultValues;
    };
    getFlightFormLabels = () => {
        const flightFormLabels: Stringified<Required<FlightFormValues>> = {
            phone_number: 'Phone Number',
            fly_from: "Origin",
            fly_to: "Destination",
            date_from: "Departure",
            return_from: "Return",
            adults: "Adults",
            children: "Children",
            infants: "Infants",
            selected_cabins: "Travel Class",
            non_stop: "Non-stop",
            curr: "Currency",
            price_to: "Price alert threshold",
            limit: "Limit results"
        }
        return flightFormLabels;
    };
    locationToLabel = (location: LocationDto) => {
        const name = this.locationToString(location);
        const sublabel = location.subdivisionName ? `${location.subdivisionName}, ${location.countryName}` 
            : location.countryName;

        return <DropdownOption name={name} sublabel={sublabel} />;
    };
    locationToString = (location?: LocationDto) => {
        return location?.name;
    };
    fetchLocations = async (search: string) => {
        if (!search) return [];

        const response = await fetch('/api/locations?search=' + encodeURIComponent(search));
        const data: LocationDto[] = await response.json();
        return data;
    };
    submitSearch = async (form: FlightFormValues) => {
        const response = await fetch('/api/flights', { method: 'POST', body: JSON.stringify(form) });
        const data: FlightDto[] = await response.json();
        return data;
    };
}

export default new FlightSearchService();