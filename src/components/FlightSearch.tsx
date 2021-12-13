import { Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, RangeSlider, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Airport } from '../pages/api/airports';
import { Combobox } from './Combobox';
import FlightSearchService from '../services/FlightSearchService';
import { FlightFormValues } from '../types/FlightSearch';

const flightFormLabels = FlightSearchService.getFlightFormLabels();
const travelClasses = FlightSearchService.getTravelClasses();

export const FlightSearch = () => {
    const [airports, setAirports] = useState<Airport[]>([]);
    const handleSubmit = () => {

    }
    const { values, errors, touched, getFieldProps: getFormikFieldProps, setFieldValue } = useFormik({
        initialValues: FlightSearchService.getDefaultFormValues(),
        onSubmit: handleSubmit
    });
    const getFieldProps = (formKey: keyof FlightFormValues) => {
        return getFormikFieldProps(formKey)
    }
    const getIsValid = (formKey: keyof FlightFormValues) => {
        return !!errors[formKey] && !!touched[formKey]
    }

    useEffect(() => {
        const fetchAndSetAirports = async () => {
            const data = await FlightSearchService.fetchAirports();
            setAirports(data);
        }
        fetchAndSetAirports();
    }, []);


    const setSelectedAirport = (airport: Airport | undefined) => {
        if (airport) {
            setFieldValue('originLocationCode', airport.id);
        }
    }

    return (<Flex border="1px" borderRadius="md" maxW="xl" flexWrap="wrap" flexDir="row" justify="center" align="center">
        <Flex w="full" flexWrap="wrap">
            <FormControl isInvalid={getIsValid('originLocationCode')} isRequired p="3">
                <FormLabel>{flightFormLabels.originLocationCode}</FormLabel>
                <Combobox items={airports} labelBy={FlightSearchService.getAirportLabel} filterBy={FlightSearchService.filterAirports} selectedItem={FlightSearchService.getAirport(airports, values.originLocationCode)} setSelectedItem={setSelectedAirport} />
                <FormErrorMessage>{errors.originLocationCode}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={getIsValid('destinationLocationCode')} isRequired p="3">
                <FormLabel>{flightFormLabels.destinationLocationCode}</FormLabel>
                <Combobox items={airports} labelBy={FlightSearchService.getAirportLabel} filterBy={FlightSearchService.filterAirports} selectedItem={FlightSearchService.getAirport(airports, values.destinationLocationCode)} setSelectedItem={setSelectedAirport} />
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
                <Input {...getFieldProps('returnDate')} type="date" min={values.departureDate.toLocaleDateString('en-CA')} />
                <FormErrorMessage>{errors.returnDate}</FormErrorMessage>
            </FormControl>
        </Flex>
        <Flex w="full">
            <FormControl isInvalid={getIsValid('adults')} isRequired p="3">
                <FormLabel>{flightFormLabels.adults}</FormLabel>
                <NumberInput {...getFieldProps('adults')} onChange={val => setFieldValue('adults', val)} min={1} max={20}>
                    <NumberInputField {...getFieldProps('adults')} />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.adults}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={getIsValid('children')} p="3">
                <FormLabel>{flightFormLabels.children}</FormLabel>
                <NumberInput {...getFieldProps('children')} onChange={val => setFieldValue('children', val)} min={1} max={20}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.children}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={getIsValid('infants')} onChange={val => setFieldValue('infants', val)} p="3">
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
                    {travelClasses.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
                </Select>
            </FormControl>
            <FormControl p="3" mt="8">
                <Checkbox {...getFieldProps('nonStop')}>{flightFormLabels.nonStop}</Checkbox>
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
                Gimme the goods
            </Button>
        </Flex>
    </Flex>)
}