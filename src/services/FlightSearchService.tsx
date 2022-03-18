import React from 'react';

import { Stringified } from "../types";
import { FlightFormValues, TravelClassOption } from "../types/FlightSearch";
import { LocationDto } from "../pages/api/locations";

import { DropdownOption } from '../components/DropdownOption';


interface IFlightSearchService {
    getTravelClasses: () => TravelClassOption[];
    locationToLabel: (airport: LocationDto) => React.ReactNode;
    getDefaultFormValues: () => FlightFormValues;
    getFlightFormLabels: () => Stringified<Required<FlightFormValues>>;
    locationToString: (airport: LocationDto) => string;
    fetchLocations: (search: string) => Promise<LocationDto[]>;
    submitSearch: (form: FlightFormValues) => Promise<boolean>;
}

/**
 * Used to interact with the flight API to retrieve flights
 * based on the search form
 */
class FlightSearchService implements IFlightSearchService {
    /**
     * The travel classes available to use with the flight API
     * @returns Travel classes provided by the flight API
     */
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
    /**
     * Retrieves object with deafult values for the search form
     * @returns Default values for the search form
     */
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
            limit: 5
        };
        return defaultValues;
    };
    /**
     * Gets the labels displayed to user in the search form
     * @returns Object containing corresponding labels for each search form property
     */
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
    /**
     * Retrieves a human-readable label based on a Location object
     * @param location Location to be transformed into a label
     * @returns A component displaying the location
     */
    locationToLabel = (location: LocationDto): JSX.Element => {
        const name = this.locationToString(location);
        const sublabel = location.subdivisionName ? `${location.subdivisionName}, ${location.countryName}` 
            : location.countryName;

        return <DropdownOption name={name} sublabel={sublabel} />;
    };
    /**
     * Gets the main information about the location as a string
     * @param location The location to parse
     * @returns A stringified representation of the location
     */
    locationToString = (location?: LocationDto): string => {
        return location?.name;
    };
    /**
     * Returns potential list of locations for a given search term
     * @param search The search term to query the flight locations API with
     * @returns List of LocationDto from the flights API
     */
    fetchLocations = async (search: string): Promise<LocationDto[]> => {
        if (!search) return [];

        const response = await fetch('/api/locations?search=' + encodeURIComponent(search));
        const data: LocationDto[] = await response.json();
        return data;
    };
    submitSearch = async (form: FlightFormValues): Promise<boolean> => {
        const response = await fetch('/api/subscriptions', { method: 'POST', body: JSON.stringify(form) });
        return response.status === 200;
    };
}

export default new FlightSearchService();