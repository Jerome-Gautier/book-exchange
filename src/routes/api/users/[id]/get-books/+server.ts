/* eslint-disable @typescript-eslint/no-explicit-any */
import books from '$lib/data/books.json';
import trades from '$lib/data/trades.json';
import users from '$lib/data/users.json';

export async function GET({ params }) {
	const userId = params.id;

	const user = users.find((user) => user.id === userId);
	if (!user) {
		return new Response(JSON.stringify({ error: 'User not found' }), {status: 404 });
	}
	const availableBooks = books
		.filter((b) => b.ownerId === userId && b.status === 'available')
		.map((book) => {
			const data = (trades as any[]).filter(
				(trade: any) => trade.status === 'pending' && Array.isArray(trade.requestedBooks) && trade.requestedBooks.some((rb: any) => rb.id === book.id)
			);

			const requests = [];

			for (const request of data) {
				const fromUser = users.find((u) => u.id === request.fromUserId);
				const primaryToUserId = Array.isArray(request.requestedBooks) && request.requestedBooks.length > 0 ? request.requestedBooks[0].ownerId : null;
				const toUser = primaryToUserId ? users.find((u) => u.id === primaryToUserId) : null;
				const offeredBook = books.find((b) => b.id === request.offeredBookId);

				if (fromUser && toUser) {
					const requestedBooks = (request.requestedBooks || []).map((rb: any) => {
						const bookDetails = books.find((b: any) => b.id === rb.id);
						if (!bookDetails) return null;
						return {
							id: bookDetails.id,
							title: bookDetails.title,
							author: bookDetails.author,
							condition: bookDetails.condition,
							requestsCount: (trades as any[]).filter((t: any) => Array.isArray(t.requestedBooks) && t.requestedBooks.some((r: any) => r.id === bookDetails.id)).length
						};
					}).filter(Boolean);

					requests.push({
						id: request.id,
						requestedBooks,
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
				...book,
				id: book.id,
				requests
			};
		});

	return new Response(JSON.stringify({
		user: {
			...user,
			books: availableBooks
		}
	}));
}