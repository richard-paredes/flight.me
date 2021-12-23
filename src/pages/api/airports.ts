import type { NextApiRequest, NextApiResponse } from 'next'
import { KiwiApi } from '../../services/KiwiApiClient';

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

const kiwiApi = new KiwiApi(process.env.KIWI_API_URL, process.env.KIWI_API_TOKEN);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const searchTerm = req.query.search.toString();
    const results = await kiwiApi.locations.query({
        term: searchTerm,
        location_types: ['airport', 'city', 'country'],
        limit: 50,
        active_only: true,
        sort: 'name'
    });

    res.status(200).json(results);
}