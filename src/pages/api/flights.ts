import type { NextApiRequest, NextApiResponse } from 'next';
import { FlightPriceTrackingService } from '../../services/FlightPriceTrackingService';
import { FlightPriceSubscription } from '../../types/FlightPriceTracking/FlightPriceSubscription';

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

    const form = JSON.parse(req.body) as FlightPriceSubscription;
    
    const flightDtos = FlightPriceTrackingService.searchFlights(form);

    return res.status(200).json(flightDtos);
}