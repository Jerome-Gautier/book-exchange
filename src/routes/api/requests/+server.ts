import books from '$lib/data/books.json';
import requests from '$lib/data/requests.json';
import users from '$lib/data/users.json';

import fs from 'fs';
import path from 'path';

export async function GET({ url }) {
    const bookId = url.searchParams.get('id');

    const requestsMap = bookId
        ? requests.filter((t) => t.offeredBooksIds.includes(bookId) || (Array.isArray(t.requestedBooks) && t.requestedBooks.some((rb) => rb.id === bookId)))
        : requests;

    const requestsData = requestsMap.map((request) => {
        const fromUser = users.find((u) => u.id === request.fromUserId) || null;
        const offeredBooks = request.offeredBooksIds.map((bid) => books.find((b) => b.id === bid));
        const requestedBooks = request.requestedBooks
            .map((elem) => {
                const bookId = typeof elem === 'string' ? elem : elem.id;
                const book = books.find((b) => b.id === bookId);
                const ownerId = typeof elem === 'string' ? null : elem.ownerId;
                const owner = ownerId ? users.find((u) => u.id === ownerId) : null;
                const incoming = requests.filter((r) => r.requestedBooks.some((rb) => {
                    if (typeof rb === 'string') {
                        return rb === (typeof elem === 'string' ? elem : elem.id);
                    } else {
                        return rb.id === (typeof elem === 'string' ? elem : elem.id);
                    }
                }));
                return {
                    ...book,
                    ownerUsername: owner?.username,
                    incomingRequests: incoming.length
                };
            });

        return {
            id: request.id,
            fromUser,
            offeredBooks,
            requestedBooks,
        }
    });

    return new Response(JSON.stringify({ requests: requestsData }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export async function POST({ request }) {
    const requestData = await request.json();

    // Validate incoming request data
    const { fromUserId, offeredBooksIds, requestedBooks } = requestData;
    console.log('Creating new request from', fromUserId, 'offering', offeredBooksIds, 'for', requestedBooks);

    // Require basic fields (requestedBooks or requestedBooksIds required)
    if (!fromUserId || requestedBooks.length < 1 || offeredBooksIds.length < 1) {
        return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    const newRequest = {
        id: `t${fromUserId}${Date.now()}`,
        fromUserId: fromUserId,
        offeredBooksIds,
        requestedBooks,
        createdAt: new Date().toISOString()
    };

    requests.push(newRequest);

    fs.writeFileSync(path.resolve('src/lib/data/requests.json'), JSON.stringify(requests, null, 2));

    return new Response(JSON.stringify({ success: true, request: newRequest }), { status: 201 });
}

export async function DELETE({ request }) {
    const requestData = await request.json();
    const { requestId } = requestData;

    if (!requestId) {
        return new Response(JSON.stringify({ error: 'requestId required' }), { status: 400 });
    }

    const requestIndex = requests.findIndex((r) => r.id === requestId);

    if (requestIndex === -1 || requests[requestIndex].fromUserId !== requestData.userId) {
        return new Response(JSON.stringify({ error: 'Request not found' }), { status: 404 });
    }

    requests.splice(requestIndex, 1);

    fs.writeFileSync(path.resolve('src/lib/data/requests.json'), JSON.stringify(requests, null, 2));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
