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
    }

    const tradeOffers: TradeOffer[] = [];

    requests.forEach((req: BookRequest) => {
        req.offeredBooks.forEach((offeredBook) => {
            req.requestedBooks.forEach((requestedBook) => {
                if (requestedBook.owner._id !== session?.user?.id) return;  
                tradeOffers.push({
                    requestId: req._id,
                    offeredBook,
                    requestedBook
                });
            });
        });
    });
    
    return {
        userId: session.user.id,
        tradeOffers
    }
}