import type { NextApiRequest, NextApiResponse } from 'next';

import { FlightFormValues } from '../../types/FlightSearch';

import { FlightMeContext } from '../../services/FlightMeContext';
import { SmsService } from '../../services/SmsService';
import { FlightApi } from '../../services/FlightApi';
import { FlightPriceTrackingServiceImpl } from '../../services/FlightPriceTrackingService';

const phoneSubscriptionsService = new FlightPriceTrackingServiceImpl(FlightMeContext, SmsService, FlightApi);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(404);
    }

    try {
        const { phone_number: phoneNumber, ...subscription } = JSON.parse(req.body) as FlightFormValues;
        await phoneSubscriptionsService.upsertPhoneSubscription(phoneNumber, subscription);

        return res.status(200).json('OK');
    } catch (err) {
        console.log('Failed to add subscription');
        console.error(err);
    }

    return res.status(500).json('Error');
}