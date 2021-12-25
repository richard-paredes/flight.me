import React, { useState } from 'react';
import { FieldInputProps, Form, FormikProps } from 'formik';
import { Flex, FormControl, FormLabel, FormErrorMessage, Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, Checkbox, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Button } from '@chakra-ui/react';
import PhoneNumberInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
import styled from '@emotion/styled';

import { Combobox } from '../../components/Combobox';

import { LocationDto } from '../../pages/api/locations';
import { FlightFormValues } from '../../types/FlightSearch';
import FlightSearchService from '../../services/FlightSearchService';
import { UseComboboxStateChange } from 'downshift';

interface FlightSearchFormProps extends FormikProps<FlightFormValues> {
    getFieldProps: (field: keyof FlightFormValues) => FieldInputProps<any>;
    setFieldTouched: (field: keyof FlightFormValues, shouldValidate?: boolean) => void;
    setFieldValue: (field: keyof FlightFormValues, value: any, shouldValidate?: boolean) => void;
}

const flightFormLabels = FlightSearchService.getFlightFormLabels();
const travelClasses = FlightSearchService.getTravelClasses();

const searchTimeouts = {
    fly_from: null,
    fly_to: null
};

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ values, errors, touched, isSubmitting, setFieldTouched, getFieldProps, setFieldValue }) => {
    const [locationSearch, setLocationSearch] = useState({
        fly_from: {
            loading: false,
            data: []
        },
        fly_to: {
            loading: false,
            data: []
        }
    });
    const getIsValid = (formKey: keyof FlightFormValues) => {
        return !!errors[formKey] && touched[formKey];
    };
    const setLocations = (field: keyof FlightFormValues, { inputValue, selectedItem }: UseComboboxStateChange<LocationDto>) => {
        if (inputValue === FlightSearchService.locationToString(selectedItem)) return;
        if (values[field]) setFieldValue(field, '');

        setLocationSearch(prev => ({
            ...prev, [field]: {
                loading: true,
                data: []
            }
        }));
        clearTimeout(searchTimeouts[field]);
        searchTimeouts[field] = setTimeout(async () => {
            const data = await FlightSearchService.fetchLocations(inputValue);
            setLocationSearch(prev => ({
                ...prev, [field]: {
                    loading: false,
                    data
                }
            }));
        }, 450);
    }


    return (
        <Form>
            <Flex flexDir="column" minW="xl" maxW="xl">
                <Flex w="full" flexWrap="wrap">
                    <FormControl isInvalid={getIsValid('phone_number')} isRequired p="3">
                        <FormLabel>{flightFormLabels.phone_number}</FormLabel>
                        <StyledPhoneNumberInput
                            {...getFieldProps('phone_number')}
                            placeholder="Phone number"
                            onChange={(phone) => setFieldValue('phone_number', phone, true)}
                            inputComponent={Input}
                            defaultCountry='US'
                        />
                        <FormErrorMessage>{errors.phone_number}</FormErrorMessage>
                    </FormControl>
                </Flex>
                <Flex w="full" flexWrap="wrap">
                    <FormControl isInvalid={getIsValid('fly_from')} isRequired p="3">
                        <FormLabel>{flightFormLabels.fly_from}</FormLabel>
                        <Combobox
                            {...getFieldProps('fly_from')}
                            placeholder='Origin city'
                            loading={locationSearch.fly_from.loading}
                            items={locationSearch.fly_from.data}
                            toDropdownOption={FlightSearchService.locationToLabel}
                            onBlur={() => setFieldTouched('fly_from')}
                            onInputValueChange={changes => setLocations('fly_from', changes)}
                            onSelectedItemChange={({ selectedItem }) => setFieldValue('fly_from', selectedItem?.id)}
                            itemToString={FlightSearchService.locationToString}
                        />
                        <FormErrorMessage>{errors.fly_from}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={getIsValid('fly_to')} isRequired p="3">
                        <FormLabel>{flightFormLabels.fly_to}</FormLabel>
                        <Combobox
                            {...getFieldProps('fly_to')}
                            placeholder='Destination city'
                            loading={locationSearch.fly_to.loading}
                            onBlur={() => setFieldTouched('fly_to')}
                            items={locationSearch.fly_to.data}
                            toDropdownOption={FlightSearchService.locationToLabel}
                            onInputValueChange={changes => setLocations('fly_to', changes)}
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
                        Subscribe to price drops
                    </Button>
                </Flex>
            </Flex>
        </Form>
    );
}

const StyledPhoneNumberInput = styled(PhoneNumberInput)`
    select { 
        background: white;
    }
`;