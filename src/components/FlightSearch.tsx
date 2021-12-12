import { Flex, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useFormik } from 'formik';

type TravelClass = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";

interface FlightFormValues {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: Date;
    returnDate: Date;
    adults: number;
    children?: number;
    infants?: number;
    travelClass?: TravelClass;
    includedAirlineCodes?: string[];
    excludedAirlineCodes?: string[];
    nonStop?: boolean;
    currencyCode?: string;
    maxPrice?: number;
    max?: number;
}

type Stringified<T extends object> = {
    [K in keyof T]: string;
}
const today = new Date();

const defaultFlightFormValues: FlightFormValues = {
    originLocationCode: '',
    destinationLocationCode: '',
    departureDate: new Date(today),
    returnDate: new Date(today.getDate() + 1),
    adults: 0
}
const flightFormLabels: Stringified<Required<FlightFormValues>> = {
    originLocationCode: "Origin",
    destinationLocationCode: "Destination",
    departureDate: "Departure date",
    returnDate: "Return date",
    adults: "Number of adults",
    children: "Number of children",
    infants: "Number of infants",
    travelClass: "Travel Class",
    includedAirlineCodes: undefined,
    excludedAirlineCodes: undefined,
    nonStop: "Non-stop",
    currencyCode: undefined,
    maxPrice: "Max Price",
    max: undefined
}

const FlightSearch = (props) => {
    const handleSubmit = () => {

    }
    const { values, errors, touched, getFieldProps: getFormikFieldProps } = useFormik({
        initialValues: defaultFlightFormValues,
        onSubmit: handleSubmit
    });
    const getFieldProps = (formKey: keyof FlightFormValues) => {
        return getFormikFieldProps(formKey)
    }
    const getIsValid = (formKey: keyof FlightFormValues) => {
        return !!errors[formKey] && !!touched[formKey]
    }
    return (<Flex>
        <FormControl isInvalid={getIsValid('originLocationCode')}>
            <FormLabel>{flightFormLabels.originLocationCode}</FormLabel>
            <Input {...getFieldProps('originLocationCode')} />
            <FormErrorMessage>{errors.originLocationCode}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={getIsValid('destinationLocationCode')}>
            <FormLabel>{flightFormLabels.destinationLocationCode}</FormLabel>
            <FormErrorMessage>{errors.destinationLocationCode}</FormErrorMessage>
        </FormControl>
    </Flex>)
}