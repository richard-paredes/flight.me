import React, { useEffect, useState } from 'react';
import { FieldInputProps, FormikErrors, FormikTouched } from 'formik';
import { Flex, FormControl, FormLabel, FormErrorMessage, Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, Checkbox, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Button, Box } from '@chakra-ui/react';

import { Combobox } from './Combobox';

import { Airport } from '../pages/api/airports';
import { FlightFormValues } from '../types/FlightSearch';
import FlightSearchService from '../services/FlightSearchService';

interface FlightSearchFormProps {
    values: FlightFormValues;
    errors: FormikErrors<FlightFormValues>;
    touched: FormikTouched<FlightFormValues>;
    isSubmitting: boolean;
    getFieldProps(field: string): FieldInputProps<any>;
    setFieldValue(field: string, value: any, shouldValidate?: boolean): void;
    submitForm(): Promise<void>;
}

const flightFormLabels = FlightSearchService.getFlightFormLabels();
const travelClasses = FlightSearchService.getTravelClasses();

let fromSearchTimeout: NodeJS.Timeout;
let toSearchTimeout: NodeJS.Timeout;

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ values, errors, touched, isSubmitting, getFieldProps, setFieldValue, submitForm }) => {
    const [fromAirports, setFromAirports] = useState<Airport[]>([]);
    const [toAirports, setToAirports] = useState<Airport[]>([]);

    const getIsValid = (formKey: keyof FlightFormValues) => {
        return !!errors[formKey] && !!touched[formKey]
    }

    return (
        <form onSubmit={submitForm}>
            <Flex flexDir="column" minW="xl" maxW="xl">
                <Flex w="full" flexWrap="wrap">
                    <FormControl isInvalid={getIsValid('originLocationCode')} isRequired p="3">
                        <FormLabel>{flightFormLabels.originLocationCode}</FormLabel>
                        <Combobox items={fromAirports} onInputValueChange={(changes) => { 
                            clearTimeout(fromSearchTimeout);
                            fromSearchTimeout = setTimeout(async () => {
                                const airports = await FlightSearchService.fetchAirports(changes.inputValue);
                                setFromAirports(airports);
                            }, 1000);
                        }} />
                        <FormErrorMessage>{errors.originLocationCode}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={getIsValid('destinationLocationCode')} isRequired p="3">
                        <FormLabel>{flightFormLabels.destinationLocationCode}</FormLabel>
                        <Combobox items={toAirports} onInputValueChange={(changes) => { 
                            clearTimeout(toSearchTimeout);
                            toSearchTimeout = setTimeout(async () => {
                                const airports = await FlightSearchService.fetchAirports(changes.inputValue);
                                setToAirports(airports);
                            }, 1000);
                        }}/>
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
                        <Input {...getFieldProps('returnDate')} type="date" min={values.departureDate} />
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
                        <NumberInput {...getFieldProps('children')} onChange={val => setFieldValue('children', val)} min={0} max={20}>
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
                        <NumberInput {...getFieldProps('infants')} onChange={val => setFieldValue('infants', val)} min={0} max={20}>
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
                            <NumberInput {...getFieldProps('maxPrice')}
                                value={`$${values.maxPrice}`}
                                step={10}
                                min={10}
                                max={2000}
                                onChange={val => setFieldValue('maxPrice', val.replace(/^\$/, ''))}
                                maxW='100px'
                                mr='1rem'>
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
                    <Button colorScheme="green" onClick={submitForm} type="submit" isLoading={isSubmitting}>
                        Gimme the goods
                    </Button>
                </Flex>
            </Flex>
        </form>
    );
}