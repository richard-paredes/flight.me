import type { NextApiRequest, NextApiResponse } from 'next'

// this should be a webjob
// we save the search values & run this nightly to check when price drops
// if prices drop a certain threshold, send a message to the user!
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(404);
    }
    try {
        
         return res.status(200).json([]);
    }
    catch (err) {
        
        return res.status(400).json(null);
    }
}