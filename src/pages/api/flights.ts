import type { NextApiRequest, NextApiResponse } from 'next';
import { IKiwiApi, KiwiApi } from '../../services/KiwiApiClient';
import { FlightPriceSubscription } from '../../types/FlightPriceTracking/FlightPriceSubscription';

const kiwiApi: IKiwiApi = new KiwiApi(process.env.KIWI_API_URL, process.env.KIWI_API_TOKEN);

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

    const response = await kiwiApi.searches.search({
        ...form,
        date_to: form.date_from,
        return_to: form.return_from,
        locale: 'en',
        sort: 'price',
        max_stopovers: form.non_stop && 0
    });

    const flightDtos = response.data.map((x): FlightDto => ({
        id: x.id,
        flyFrom: x.flyFrom,
        flyTo: x.flyTo,
        cityFrom: x.cityFrom,
        cityTo: x.cityTo,
        countryFrom: x.countryFrom?.name,
        countryTo: x.countryTo?.name,
        price: x.price,
        deepLink: x.deep_link
    }));

    return res.status(200).json(flightDtos);
}