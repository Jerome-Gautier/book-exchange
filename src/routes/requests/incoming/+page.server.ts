import type { BookRequest, OfferedBook, RequestedBook } from '$lib/models/models.js';

export async function load({ fetch, locals }) {
    const session = await locals.auth();

    if (!session?.user?.id) {
        throw new Error('User not authenticated');
    }

    const response = await fetch('/api/requests/incoming?userId=' + session.user.id);

    if (response.status !== 200) {
        throw new Error('Failed to fetch incoming requests');
    }

    const { requests } = await response.json();

    interface TradeOffer {
        requestId: string;
        offeredBook: OfferedBook;
        requestedBook: RequestedBook;
        requester: {
            _id: string;
            key: string;
        };
    }

    const tradeOffers: TradeOffer[] = [];
    console.log(requests[0].requestedBooks[0].book.requests)

    requests.forEach((req: BookRequest) => {
        req.offeredBooks.forEach((offeredBook) => {
            req.requestedBooks.forEach((requestedBook) => {
                if (requestedBook.owner._id !== session?.user?.id) return; // Ensure the requested book belongs to the current user    
                tradeOffers.push({
                    requestId: req._id,
                    offeredBook,
                    requestedBook,
                    requester: req.requester
                });
            });
        });
    });
    
    return {
        userId: session.user.id,
        tradeOffers
    }
}