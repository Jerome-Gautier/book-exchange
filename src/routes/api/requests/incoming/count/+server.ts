import requests from "$lib/data/requests.json";

import { countIncomingRequestsForUser } from '$lib/utils/utils.js';

export async function GET({ url }) {
    const userId = url.searchParams.get('userId');

    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    const requestsCount = countIncomingRequestsForUser(userId, requests);

    return new Response(JSON.stringify({ count: requestsCount }), { status: 200 });
}