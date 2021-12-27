import type { NextApiRequest, NextApiResponse } from 'next'
import { FlightApi } from '../../services/FlightApi';
import { FlightPriceTrackingService } from '../../services/FlightPriceTrackingService';

export type LocationDto = {
    id: string;
    name: string;
    subdivisionName?: string;
    countryName?: string;
    type: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const searchTerm = req.query.search.toString();

    const locationDtos = await FlightPriceTrackingService.searchLocations(searchTerm);

    res.status(200).json(locationDtos);
};