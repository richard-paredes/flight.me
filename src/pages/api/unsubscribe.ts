import type { NextApiRequest, NextApiResponse } from 'next';

import { FlightFormValues } from '../../types/FlightSearch';

import { FlightPriceTrackingService } from '../../services/FlightPriceTrackingService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(404);
    }
    const { phone, sid } = req.query;
    const phoneNumber = decodeURIComponent(phone as string)
    const subscriptionId = parseInt(decodeURIComponent(sid as string), 10);
    try {
        await FlightPriceTrackingService.unsubscribe(phoneNumber, subscriptionId);
        return res.redirect('/unsubscribed/success')
    } catch (err) {
        console.error(err);
    }
    
    return res.redirect('/unsubscribed/unsuccessful');
}