import { Flex, useToast } from '@chakra-ui/react';
import { Formik, FormikHelpers } from 'formik';

import { FlightSearchForm } from './FlightSearchForm';
import { FlightFormValues } from '../../types/FlightSearch';
import FlightSearchService from '../../services/FlightSearchService';
import { FlightSearchValidationSchema } from './FlightSearchValidationSchema';

export const FlightSearch = () => {
    const toast = useToast();
    const handleSubmit = async (values: FlightFormValues, helpers: FormikHelpers<FlightFormValues>) => {
        const success = await FlightSearchService.submitSearch(values);
        helpers.setSubmitting(false);
        toast({
            position: 'top',
            title: success ? 'Subscription created.' : 'Something went wrong.',
            description: success ? "You're now subscribed to this price alert." : "We're unable to subscribe you to this price alert at this time.",
            status: success ? 'success' : 'error',
            duration: 5000,
            isClosable: true,
        });
    }

    return (
        <Flex bgColor="blackAlpha.400" p="5" borderRadius="3xl" boxShadow="lg" flexDir="row" flexWrap="wrap" maxW="xl">
            <Formik initialValues={FlightSearchService.getDefaultFormValues()} onSubmit={handleSubmit} validationSchema={FlightSearchValidationSchema}>
                {(formConfig) => <FlightSearchForm {...formConfig} />}
            </Formik>
        </Flex>
    );
}