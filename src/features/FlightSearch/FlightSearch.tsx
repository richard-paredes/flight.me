import { useState } from 'react';
import Yup from 'yup';
import { Flex } from '@chakra-ui/react';
import { Formik, FormikHelpers } from 'formik';

import { FlightDto } from '../../pages/api/flights';

import { FlightSearchForm } from './FlightSearchForm';
import { FlightFormValues } from '../../types/FlightSearch';
import FlightSearchService from '../../services/FlightSearchService';
import { FlightSearchValidationSchema } from './FlightSearchValidationSchema';

export const FlightSearch = () => {
    const [results, setResults] = useState<FlightDto[]>();

    const handleSubmit = async (values: FlightFormValues, helpers: FormikHelpers<FlightFormValues>) => {
        const searchResults = await FlightSearchService.submitSearch(values);
        helpers.setSubmitting(false);
        setResults(searchResults);
    }

    return (
        <Flex border="1px" borderRadius="md" flexDir="row" flexWrap="wrap">
            <Formik initialValues={FlightSearchService.getDefaultFormValues()} onSubmit={handleSubmit} validationSchema={FlightSearchValidationSchema}>
                {(formConfig) => <FlightSearchForm {...formConfig} />}
            </Formik>
        </Flex>
    );
}