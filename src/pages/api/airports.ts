import type { NextApiRequest, NextApiResponse } from 'next'
import { IKiwiApi, KiwiApi } from '../../services/KiwiApiClient';

const kiwiApi: IKiwiApi = new KiwiApi(process.env.KIWI_API_URL, process.env.KIWI_API_TOKEN);

export type LocationDto = {
    id: string;
    name: string;
    stateName?: string;
    countryName: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const searchTerm = req.query.search.toString();

    const response = await kiwiApi.locations.query({
        term: searchTerm,
        location_types: ['city'],
        limit: 50,
        active_only: true
    });

    const locationDtos = response.locations.map(x => {
        const dto: LocationDto = {
            id: x.id,
            name: x.name,
            stateName: x.subdivision?.name,
            countryName: x.country.name
        };
        return dto;
    });

    res.status(200).json(locationDtos);
};