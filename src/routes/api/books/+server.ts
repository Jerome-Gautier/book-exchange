import books from '$lib/data/books.json';
import users from '$lib/data/users.json';
import trades from '$lib/data/trades.json';

export async function GET({ url }) {
	const userId = url.searchParams.get('id');
	const availableBooks = [];
	const bookMap = new Map(books.map((b) => [b.id, b]));
	for (const user of users) {
		for (const entry of user.books) {
			if (entry.status === 'available' || entry.status === 'wanted') {
				availableBooks.push({
					...bookMap.get(entry.bookId),
					condition: entry.condition,
					owner: {
						id: user.id,
						username: user.username,
						location: user.location
					},
					trades: trades
						.filter((trade) => trade.requestedBookId === entry.bookId && trade.status === 'pending')
						.map((trade) => ({
							bookId: trade.requestedBookId,
							tradeId: trade.id,
							fromUserId: trade.fromUserId,
							fromUsername: users.find((u) => u.id === trade.fromUserId)?.username || 'Unknown'
						}))
				});
			}
		}
	}

    if (userId) {
        const user = users.find((u) => u.id === userId);

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        availableBooks.filter((book) => book.owner.id === user.id);

        return new Response(
            JSON.stringify({
                username: user.username,
                books: availableBooks.filter((book) => book.owner.id === user.id)
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

	return new Response(
		JSON.stringify({
			availableBooks
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}
