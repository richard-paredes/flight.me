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
    submitSearch: (form: FlightFormValues) => Promise<void>;
}

class FlightSearchService implements IFlightSearchService {
    getTravelClasses = (): TravelClassOption[] => {
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
    getDefaultFormValues = (): FlightFormValues => {
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
    getFlightFormLabels = (): Stringified<Required<FlightFormValues>> => {
        return {
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
        };
    };
    locationToLabel = (location: LocationDto): JSX.Element => {
        const name = this.locationToString(location);
        const sublabel = location.subdivisionName ? `${location.subdivisionName}, ${location.countryName}` 
            : location.countryName;

        return <DropdownOption name={name} sublabel={sublabel} />;
    };
    locationToString = (location?: LocationDto): string => {
        return location?.name;
    };
    fetchLocations = async (search: string): Promise<LocationDto[]> => {
        if (!search) return [];

        const response = await fetch('/api/locations?search=' + encodeURIComponent(search));
        const data: LocationDto[] = await response.json();
        return data;
    };
    submitSearch = async (form: FlightFormValues): Promise<void> => {
        const response = await fetch('/api/subscriptions', { method: 'POST', body: JSON.stringify(form) });
        if (response.status === 200) {
            console.log('Successfully done!');
        } else {
            console.log('It failed ):');
        }
    };
}

export default new FlightSearchService();