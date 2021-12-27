import type { NextApiRequest, NextApiResponse } from 'next';

import { FlightFormValues } from '../../types/FlightSearch';
import { AppContext } from '../../services/FlightMeContext'
import { PhoneSubscription } from '../../types/FlightPriceTracking/PhoneSubscription';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(404);
    }

    const { phone_number, ...subscription } = JSON.parse(req.body) as FlightFormValues;

    try {
        await AppContext.initialize();
        const existingSubscription = await AppContext.phoneSubscriptions()
            .getByPhoneNumber(phone_number);

        if (existingSubscription) {
            existingSubscription.subscriptions
                .push(subscription);
            await AppContext.phoneSubscriptions()
                .replace(existingSubscription);
        } else {
            const phoneSubscription: PhoneSubscription = {
                phoneNumber: phone_number,
                subscriptions: [subscription]
            }

            await AppContext.phoneSubscriptions()
                .create(phoneSubscription);
        }
        
        return res.status(200).json('OK');
    } catch (err) {
        console.error(err);
        return res.status(500).json('Error');
    }

}