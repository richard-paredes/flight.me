import * as Yup from 'yup';

import { FlightFormValues, TravelClasses } from '../../types/FlightSearch';

export const FlightSearchValidationSchema: Yup.SchemaOf<FlightFormValues> = Yup.object().shape({ 
    fly_from: Yup.string()
        .required('Required'),
    fly_to: Yup.string()
        .required('Required'),
    date_from: Yup.string()
        .required('Required'),
    return_from: Yup.string()
        .required('Required'),
    adults: Yup.number()
        .min(0, 'Cannot be negative')
        .max(5, 'Too many adults'), 
    children: Yup.number()
        .min(0, 'Cannot be negative')
        .max(5, 'Too many children'),
    infants: Yup.number()
        .min(0, 'Cannot be negative')
        .max(5, 'Too many infants')
        .required('Required'),
    selected_cabins: Yup.string()
        .oneOf(TravelClasses, 'Invalid travel class')
        .required('Required'),
    non_stop: Yup.boolean()
        .required('Required'),
    curr: Yup.string()
        .oneOf(['USD'], 'Selected currency is not supported')
        .required('Required'),
    price_to: Yup.number()
        .min(0, 'Cannot be negative')
        .max(2000, 'Price is too high')
        .required('Required'),
    limit: Yup.number()
        .min(1, 'Cannot be less than 1')
        .max(100, 'Too many results requested')
        .required('Required')
});