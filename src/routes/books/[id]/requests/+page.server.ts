import books from '$lib/data/books.json';
import trades from '$lib/data/trades.json';
import users from '$lib/data/users.json';

export async function load({ params }) {
    const bookId = params.id;
    const requests = [];

    const book = books.find(b => b.id === bookId);
    if (!book) {
        return {
            status: 404,
            error: 'Book not found'
        };
    }

    const data = trades.filter((trade) => trade.status === "pending" && trade.requestedBookId === book.id);
    
    for (const request of data) {
        const fromUser = users.find((u) => u.id === request.fromUserId);
        const toUser = users.find((u) => u.id === request.toUserId);
        const offeredBook = books.find((b) => b.id === request.offeredBookId);

        if (fromUser && toUser) {
            requests.push({
                id: request.id,
                requestedBooks: fromUser.books.filter(book => book.status === 'wanted').map(book => {
                    const bookDetails = books.find(b => b.id === book.bookId);
                    if (!bookDetails) return null;
                    return {
                        id: bookDetails.id,
                        title: bookDetails.title,
                        author: bookDetails.author,
                        requestsCount: trades.filter(b => b.requestedBookId === bookDetails.id).length
                    }
                }),
                offeredBook,
                fromUser: {
                    id: fromUser.id,
                    username: fromUser.username,
                    location: fromUser.location
                },
                toUser: {
                    id: toUser.id,
                    username: toUser.username
                },
                status: request.status
            });
        }
    }
    
    return {
        book,
        requests
    }
}