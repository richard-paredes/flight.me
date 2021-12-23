import { Flex, Text } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useState } from 'react';

import FlightSearchService from '../services/FlightSearchService';
import { FlightSearchForm } from './FlightSearchForm';

export const FlightSearch = () => {
    const [results, setResults] = useState<any[]>();
    const handleSubmit = async () => {
        const searchResults = await FlightSearchService.submitSearch(formConfig.values);
        setSubmitting(false);
        setResults(searchResults);
    }

    const { setSubmitting, ...formConfig} = useFormik({
        initialValues: FlightSearchService.getDefaultFormValues(),
        onSubmit: handleSubmit
    });

    return (<Flex border="1px" borderRadius="md" flexDir="row" flexWrap="wrap">
        <FlightSearchForm {...formConfig} />
        <Flex hidden={!results} minW="xl" maxW="xl" flexWrap="wrap" justify="stretch" align="stretch" bg="green">
            <Text fontSize="xl">Hello gamer</Text>
        </Flex>

    </Flex>)
}