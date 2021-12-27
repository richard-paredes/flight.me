import type { NextApiRequest, NextApiResponse } from 'next';

import { FlightFormValues } from '../../types/FlightSearch';

import { FlightMeContext } from '../../services/FlightMeContext';
import { SmsService } from '../../services/SmsService';
import { FlightApi } from '../../services/FlightApiService';
import { FlightPriceTrackingServiceImpl } from '../../services/FlightPriceTrackingService';

const phoneSubscriptionsService = new FlightPriceTrackingServiceImpl(FlightMeContext, SmsService, FlightApi);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST' && req.method !== 'DELETE') {
        return res.status(404);
    }

    if (req.method === 'POST') {
        handleSubscription(req, res);
        return res.status(200).json('OK');
    }
    if (req.method === 'DELETE') {
        handleUnsubscription(req, res);
        return res.status(200).json('OK');
    }


    return res.status(500).json('Error');
}

async function handleSubscription(req: NextApiRequest, res: NextApiResponse) {
    const { phone_number: phoneNumber, ...subscription } = JSON.parse(req.body) as FlightFormValues;
    await phoneSubscriptionsService.subscribe(phoneNumber, subscription);
}

async function handleUnsubscription(req: NextApiRequest, res: NextApiResponse) {
    const { phoneNumber, subscriptionId } = JSON.parse(req.body);
}
