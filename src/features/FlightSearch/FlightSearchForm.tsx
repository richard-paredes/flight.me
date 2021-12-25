import React, { useEffect, useState } from 'react';
import { FieldInputProps, Form, FormikProps } from 'formik';
import { Flex, FormControl, FormLabel, FormErrorMessage, Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, Checkbox, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Button } from '@chakra-ui/react';

import { Combobox } from '../../components/Combobox';

import { LocationDto } from '../../pages/api/locations';
import { FlightFormValues } from '../../types/FlightSearch';
import FlightSearchService from '../../services/FlightSearchService';

interface FlightSearchFormProps extends FormikProps<FlightFormValues> {
    getFieldProps: (field: keyof FlightFormValues) => FieldInputProps<any>;
    setFieldTouched: (field: keyof FlightFormValues, shouldValidate?: boolean) => void;
    setFieldValue: (field: keyof FlightFormValues, value: any, shouldValidate?: boolean) => void;
}

const flightFormLabels = FlightSearchService.getFlightFormLabels();
const travelClasses = FlightSearchService.getTravelClasses();

let fromSearchTimeout: NodeJS.Timeout;
let toSearchTimeout: NodeJS.Timeout;

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ values, errors, touched, isSubmitting, setFieldTouched, getFieldProps, setFieldValue }) => {
    const [fromAirports, setFromAirports] = useState<LocationDto[]>([]);
    const [toAirports, setToAirports] = useState<LocationDto[]>([]);

    useEffect(() => { console.log(touched) }, [touched])
    const getIsValid = (formKey: keyof FlightFormValues) => {
        return !!errors[formKey] && touched[formKey];
    }

    return (
        <Form>
            <Flex flexDir="column" minW="xl" maxW="xl">
                <Flex w="full" flexWrap="wrap">
                    <FormControl isInvalid={getIsValid('fly_from')} isRequired p="3">
                        <FormLabel>{flightFormLabels.fly_from}</FormLabel>
                        <Combobox
                            {...getFieldProps('fly_from')}
                            placeholder='Origin city'
                            items={fromAirports}
                            toDropdownOption={FlightSearchService.locationToLabel}
                            onBlur={() => setFieldTouched('fly_from')}
                            onInputValueChange={({ inputValue, selectedItem }) => {
                                if (inputValue === FlightSearchService.locationToString(selectedItem)) {
                                    setFieldValue('fly_from', selectedItem?.id);
                                    return;
                                }

                                if (values.fly_from) setFieldValue('fly_from', '');

                                clearTimeout(fromSearchTimeout);
                                fromSearchTimeout = setTimeout(async () => {
                                    const airports = await FlightSearchService.fetchLocations(inputValue);
                                    setFromAirports(airports);
                                }, 450);
                            }}
                            onSelectedItemChange={({ selectedItem }) => setFieldValue('fly_from', selectedItem?.id)}
                            itemToString={FlightSearchService.locationToString}
                        />
                        <FormErrorMessage>{errors.fly_from}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={getIsValid('fly_to')} isRequired p="3">
                        <FormLabel>{flightFormLabels.fly_to}</FormLabel>
                        <Combobox
                            {...getFieldProps('fly_to')}
                            onBlur={() => setFieldTouched('fly_to')}
                            placeholder='Destination city'
                            items={toAirports}
                            toDropdownOption={FlightSearchService.locationToLabel}
                            onInputValueChange={({ inputValue, selectedItem }) => {
                                if (inputValue === FlightSearchService.locationToString(selectedItem)) {
                                    setFieldValue('fly_to', selectedItem?.id);
                                    return;
                                }

                                if (values.fly_to) setFieldValue('fly_to', '');

                                clearTimeout(toSearchTimeout);
                                toSearchTimeout = setTimeout(async () => {
                                    const airports = await FlightSearchService.fetchLocations(inputValue);
                                    setToAirports(airports);
                                }, 450);
                            }}
                            onSelectedItemChange={({ selectedItem }) => setFieldValue('fly_to', selectedItem?.id)}
                            itemToString={FlightSearchService.locationToString}
                        />
                        <FormErrorMessage>{errors.fly_to}</FormErrorMessage>
                    </FormControl>
                </Flex>
                <Flex w="full">
                    <FormControl isInvalid={getIsValid('date_from')} isRequired p="3">
                        <FormLabel>{flightFormLabels.date_from}</FormLabel>
                        <Input {...getFieldProps('date_from')} type="date" required />
                        <FormErrorMessage>{errors.date_from}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={getIsValid('return_from')} isRequired p="3">
                        <FormLabel>{flightFormLabels.return_from}</FormLabel>
                        <Input {...getFieldProps('return_from')} type="date" min={values.date_from} required />
                        <FormErrorMessage>{errors.return_from}</FormErrorMessage>
                    </FormControl>
                </Flex>
                <Flex w="full">
                    <FormControl isInvalid={getIsValid('adults')} isRequired p="3">
                        <FormLabel>{flightFormLabels.adults}</FormLabel>
                        <NumberInput {...getFieldProps('adults')} onChange={val => setFieldValue('adults', val)} min={1} max={5}>
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
                        <NumberInput {...getFieldProps('children')} onChange={val => setFieldValue('children', val)} min={0} max={5}>
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
                        <NumberInput {...getFieldProps('infants')} onChange={val => setFieldValue('infants', val)} min={0} max={5}>
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
                        <FormLabel>{flightFormLabels.selected_cabins}</FormLabel>
                        <Select {...getFieldProps('selected_cabins')}>
                            {travelClasses.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
                        </Select>
                    </FormControl>
                    <FormControl p="3" mt="8">
                        <Checkbox {...getFieldProps('non_stop')}>
                            {flightFormLabels.non_stop}
                        </Checkbox>
                        <FormErrorMessage>{errors.non_stop}</FormErrorMessage>
                    </FormControl>
                </Flex>
                <Flex w="full">
                    <FormControl p="3">
                        <FormLabel>{flightFormLabels.price_to}</FormLabel>
                        <Flex>
                            <NumberInput {...getFieldProps('price_to')}
                                value={`$${values.price_to}`}
                                step={10}
                                min={10}
                                max={2000}
                                onChange={val => setFieldValue('price_to', val.replace(/^\$/, ''))}
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
                                value={values.price_to}
                                onChange={(val) => setFieldValue('price_to', val)}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb fontSize='1px' boxSize='16px' children={values.price_to} />
                            </Slider>
                        </Flex>
                    </FormControl>
                </Flex>
                <Flex w="full" justify="center" py="3">
                    <Button colorScheme="green" type="submit" isLoading={isSubmitting} disabled={isSubmitting || Object.keys(errors).length > 0}>
                        Gimme the goods
                    </Button>
                </Flex>
            </Flex>
        </Form>
    );
}