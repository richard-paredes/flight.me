import type { NextApiRequest, NextApiResponse } from 'next';
import { FlightPriceTrackingService } from '../../services/FlightPriceTrackingService';

export type FlightDto = {
    id: string;
    flyFrom: string;
    flyTo: string;
    cityFrom: string;
    cityTo: string;
    countryFrom: string;
    countryTo: string;
    price: number;
    deepLink: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(404);
    }

    if (req.headers.authorization !== `Bearer ${process.env.CRON_API_TOKEN}`) {
        return res.status(401).json('Unauthorized');
    }

    try {
        await FlightPriceTrackingService.dispatchPriceTrackers();
    } catch (err) {
        console.log('Failed to trigger alerts');
        console.error(err);
    }
    return res.status(200).json('OK');
}