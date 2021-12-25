import type { NextApiRequest, NextApiResponse } from 'next'
import { IKiwiApi, KiwiApi } from '../../services/KiwiApiClient';

export type LocationDto = {
    id: string;
    name: string;
    subdivisionName?: string;
    countryName?: string;
    type: string;
};

const kiwiApi: IKiwiApi = new KiwiApi(process.env.KIWI_API_URL, process.env.KIWI_API_TOKEN);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const searchTerm = req.query.search.toString();

    const response = await kiwiApi.locations.query({
        term: searchTerm,
        location_types: ['city', 'country', 'airport', 'subdivision'],
        limit: 50,
        active_only: true
    });

    const locationDtos = response.locations.map((x): LocationDto => ({    
            id: x.id,
            name: x.name,
            subdivisionName: x.subdivision?.name,
            countryName: x.country?.name || x.city?.country?.name,
            type: x.type
        })
    );

    res.status(200).json(locationDtos);
};