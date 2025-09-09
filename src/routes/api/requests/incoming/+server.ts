import books from '$lib/data/books.json';
import requests from '$lib/data/requests.json';
import users from '$lib/data/users.json';

import type { BookRequest, RequestedBook } from '$lib/models/models.js';

export async function GET({ url }) {
    const userId = url.searchParams.get('userId');

    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    const filteredRequests = requests.filter((r: BookRequest) => {
        return r.requestedBooks.some((rb: RequestedBook) => rb.ownerId === userId)
    });

    const incomingRequests = [];

    for (const r of filteredRequests) {
        const fromUser = users.find((u) => u.id === r.fromUserId) || null;
        for (const bookId of r.offeredBooksIds) {
            const offeredBook = books.find((b) => b.id === bookId) || null;
            for (const rb of r.requestedBooks) {
                if (rb.ownerId === userId) {
                    const requestedBook = books.find((b) => b.id === rb.id) || null;
                    incomingRequests.push({
                        id: r.id,
                        fromUser,
                        offeredBook,
                        requestedBook
                    });
                }
            }
        }
    }

    return new Response(JSON.stringify({ requests: incomingRequests }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}