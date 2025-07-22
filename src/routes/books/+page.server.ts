import books from '$lib/data/books.json';
import users from '$lib/data/users.json';
import trades from '$lib/data/trades.json';

export function load() {
	const availableBooks = [];
	const bookMap = new Map(books.map((b) => [b.id, b]));
	for (const user of users) {
		if (!user.books || user.books.length === 0) {
			continue;
		};
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

	return {
		availableBooks
	}
}
