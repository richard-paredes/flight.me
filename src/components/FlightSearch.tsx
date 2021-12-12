import { Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, RangeSlider, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { Combobox, ComboboxItem } from './Combobox';

const airports: ComboboxItem[] = [
    {
        label: 'Klana, AK',
        value: 'IAN'
    }, {
        label: 'Miami, FL - International',
        value: 'MIA'
    }, {
        label: 'Miami, FL - Sea Plane Base',
        value: 'MPB'
    }]; // pull these from somewhere!
const airportNames = airports.map(x => x.label);
const airportCodes = airports.map(x => x.value);
const getSelectedAirport = (airportCode: string) => {
    return airports.find(x => x.value === airportCode);
}
type TravelClass = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";

interface FlightFormValues {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: Date;
    returnDate: Date;
    adults: number;
    children?: number;
    infants?: number;
    travelClass: TravelClass;
    includedAirlineCodes?: string[];
    excludedAirlineCodes?: string[];
    nonStop: boolean;
    currencyCode: string;
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
    travelClass: 'ECONOMY',
    adults: 1,
    children: 0,
    infants: 0,
    nonStop: false,
    currencyCode: 'USD',
    maxPrice: 150
}
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

export const FlightSearch = () => {
    const handleSubmit = () => {

    }
    const { values, errors, touched, getFieldProps: getFormikFieldProps, setFieldValue } = useFormik({
        initialValues: defaultFlightFormValues,
        onSubmit: handleSubmit
    });
    const getFieldProps = (formKey: keyof FlightFormValues) => {
        return getFormikFieldProps(formKey)
    }
    const getIsValid = (formKey: keyof FlightFormValues) => {
        return !!errors[formKey] && !!touched[formKey]
    }

    useEffect(() => {
        console.log('Origin code changed to', values.originLocationCode)
    }, [values.originLocationCode])

    return (<Flex border="1px" borderRadius="md" maxW="md" flexWrap="wrap" flexDir="row" justify="center" align="center">
        <Flex w="full">
            <FormControl isInvalid={getIsValid('originLocationCode')} isRequired p="3">
                <FormLabel>{flightFormLabels.originLocationCode}</FormLabel>
                <Combobox items={airportNames} selectedItem={values.originLocationCode} setSelectedItem={(item) => setFieldValue('originLocationCode', airports.find(x => x.label == item))} />
                <FormErrorMessage>{errors.originLocationCode}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={getIsValid('destinationLocationCode')} isRequired p="3">
                <FormLabel>{flightFormLabels.destinationLocationCode}</FormLabel>
                <Combobox items={airportNames} selectedItem={values.destinationLocationCode} setSelectedItem={(item) => setFieldValue('originLocationCode', airports.find(x => x.label == item))} />
                <FormErrorMessage>{errors.destinationLocationCode}</FormErrorMessage>
            </FormControl>
        </Flex>
        <Flex w="full">
            <FormControl isInvalid={getIsValid('departureDate')} isRequired p="3">
                <FormLabel>{flightFormLabels.departureDate}</FormLabel>
                <Input {...getFieldProps('departureDate')} type="date" />
                <FormErrorMessage>{errors.departureDate}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={getIsValid('returnDate')} isRequired p="3">
                <FormLabel>{flightFormLabels.returnDate}</FormLabel>
                <Input {...getFieldProps('returnDate')} type="date" />
                <FormErrorMessage>{errors.returnDate}</FormErrorMessage>
            </FormControl>
        </Flex>
        <Flex w="full">
            <FormControl isInvalid={getIsValid('adults')} isRequired p="3">
                <FormLabel>{flightFormLabels.adults}</FormLabel>
                <NumberInput {...getFieldProps('adults')} min={1} max={20}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.adults}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={getIsValid('children')} p="3">
                <FormLabel>{flightFormLabels.children}</FormLabel>
                <NumberInput {...getFieldProps('children')} min={1} max={20}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.children}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={getIsValid('infants')} p="3">
                <FormLabel>{flightFormLabels.infants}</FormLabel>
                <NumberInput {...getFieldProps('infants')} min={1} max={20}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.infants}</FormErrorMessage>
            </FormControl>
        </Flex>
        <Flex w="full" align="center">
            <FormControl p="3">
                <FormLabel>{flightFormLabels.travelClass}</FormLabel>
                <Select {...getFieldProps('travelClass')}>
                    <option value="ECONOMY">Economy</option>
                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                    <option value="BUSINESS">Business</option>
                    <option value="FIRST">First</option>
                </Select>
            </FormControl>
            <FormControl p="3" mt="8">
                <Checkbox isChecked={values.nonStop}>{flightFormLabels.nonStop}</Checkbox>
                <FormErrorMessage>{errors.nonStop}</FormErrorMessage>
            </FormControl>
        </Flex>
        <Flex w="full">
            <FormControl p="3">
                <FormLabel>{flightFormLabels.maxPrice}</FormLabel>
                <Flex>
                    <NumberInput {...getFieldProps('maxPrice')} value={`$${values.maxPrice}`} step={10} min={10} max={2000} onChange={val => setFieldValue('maxPrice', val.replace(/^\$/, ''))} maxW='100px' mr='1rem'>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Slider
                        flex="1"
                        min={10}
                        max={2000}
                        step={10}
                        focusThumbOnChange={false}
                        value={values.maxPrice}
                        onChange={(val) => setFieldValue('maxPrice', val)}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb fontSize='1px' boxSize='16px' children={values.maxPrice} />
                    </Slider>
                </Flex>
            </FormControl>
        </Flex>
        <Flex w="full" justify="center" py="3">
            <Button colorScheme="green">
                Flight me!
            </Button>
        </Flex>
    </Flex>)
}