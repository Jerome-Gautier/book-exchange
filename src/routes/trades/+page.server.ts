import books from '$lib/data/books.json';
import trades from '$lib/data/trades.json';
import users from '$lib/data/users.json';

export function load() {
    const result = trades.filter(trade => trade.status === 'accepted').map(trade => {
        const offeredBook = books.find(book => book.id === trade.offeredBookId);
        const requestedBook = books.find(book => book.id === trade.requestedBookId);
        const fromUser = users.find(user => user.id === trade.fromUserId);
        const toUser = users.find(user => user.id === trade.toUserId);
        
        if (!fromUser || !toUser) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        };

        return {
            id: trade.id,
            offeredBook,
            requestedBook,
            fromUser: {
                id: fromUser.id,
                username: fromUser.username
            },
            toUser: {
                id: toUser.id,
                username: toUser.username
            }
        };
    })

    return {
        trades: result
    }
}