import type { NextApiRequest, NextApiResponse } from 'next';

import { FlightFormValues } from '../../types/FlightSearch';

import { FlightPriceTrackingService } from '../../services/FlightPriceTrackingService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST' && req.method !== 'DELETE') {
        return res.status(404);
    }

    try {
        const { phone_number: phoneNumber, ...subscription } = JSON.parse(req.body) as FlightFormValues;
        await FlightPriceTrackingService.subscribe(phoneNumber, subscription);
        return res.status(200).json('OK');
    } catch (err) {
        console.error(err);
    }

    return res.status(500).json('Error');
}