import type { NextApiRequest, NextApiResponse } from 'next';
import { AppContext } from '../../services/FlightMeContext'
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
    if (req.method !== 'GET') {
        return res.status(404);
    }
    try {

    } catch (err) {
        console.log('Failed to trigger alerts');
        console.error(err);
    }
    return res.status(200).json('OK');
}