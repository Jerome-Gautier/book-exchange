import users from '$lib/data/users.json';
import trades from '$lib/data/trades.json';

export function load() {
    const result = users.map(user => {
        return {
            id: user.id,
            username: user.username,
            location: user.location,
            booksCount: user.books.length,
            requestsCount: trades.filter(trade => trade.fromUserId === user.id && trade.status === 'pending').length,
        }
    });

    return {
        users: result
    }
}