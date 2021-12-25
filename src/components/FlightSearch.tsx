import { Flex, Text } from '@chakra-ui/react';
import { Formik, FormikHelpers, useFormik } from 'formik';
import { useState } from 'react';

import FlightSearchService from '../services/FlightSearchService';
import { FlightFormValues } from '../types/FlightSearch';
import { FlightSearchForm } from './FlightSearchForm';

export const FlightSearch = () => {
    const [results, setResults] = useState<any[]>();

    const handleSubmit = async (values: FlightFormValues, helpers: FormikHelpers<FlightFormValues>) => {
        const searchResults = await FlightSearchService.submitSearch(values);
        helpers.setSubmitting(false);
        setResults(searchResults);
    }

    return (
        <Flex border="1px" borderRadius="md" flexDir="row" flexWrap="wrap">
            <Formik initialValues={FlightSearchService.getDefaultFormValues()} onSubmit={handleSubmit}>
                {(formConfig) => <FlightSearchForm {...formConfig} />}
            </Formik>
        </Flex>
    );
}