import type { NextApiRequest, NextApiResponse } from 'next'
import airports from '../../assets/airports.json';

export interface Airport {
    id: string;
    name: string;
    city: string;
    city2?: string;
    state?: string;
    stateShort?: string;
    country: string;
    description: string;
    imageCredit: string;
    imageCreditLink?: string;
}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(airports);
}