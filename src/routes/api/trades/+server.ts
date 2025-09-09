import books from '$lib/data/books.json';
import requests from '$lib/data/requests.json';
import trades from '$lib/data/trades.json';
import users from '$lib/data/users.json';

import fs from 'fs';

export async function GET() {
	const enriched = trades.map((t) => {
		const fromUser = users.find((u) => u.id === t.fromId);
		const toUser = users.find((u) => u.id === t.toId);
		return {
			...t,
			fromUsername: fromUser ? fromUser.username : null,
			toUsername: toUser ? toUser.username : null
		};
	});

	return new Response(JSON.stringify({ trades: enriched }), { status: 200 });
}

export async function POST({ request }) {
	const data = await request.json();

	// Create new trade object
	const newTrade = {
		id: `t${Date.now()}`,
		fromId: data.requestedBook.ownerId,
		toId: data.offeredBook.ownerId,
		bookGiven: {
			title: data.requestedBook.title,
			author: data.requestedBook.author
		},
		bookTaken: {
			title: data.offeredBook.title,
			author: data.offeredBook.author
		},
		timestamp: new Date().toISOString()
	};

	// Update trades list
	trades.push(newTrade);

	fs.writeFileSync('src/lib/data/trades.json', JSON.stringify(trades, null, 2));

	// Delete books from the available books list
	books.splice(
		books.findIndex((b) => b.id === data.requestedBook.id),
		1
	);
	books.splice(
		books.findIndex((b) => b.id === data.offeredBook.id),
		1
	);

	fs.writeFileSync('src/lib/data/books.json', JSON.stringify(books, null, 2));

	// Delete the requests containing the two traded books from the ongoing requests list
	const tradedBookIds = [data.requestedBook.id, data.offeredBook.id];
	for (let i = requests.length - 1; i >= 0; i--) {
		const req = requests[i];
		req.offeredBooksIds = req.offeredBooksIds.filter((id: string) => !tradedBookIds.includes(id));
		req.requestedBooks = req.requestedBooks.filter((rb) => !tradedBookIds.includes(rb.id));
		if (req.offeredBooksIds.length === 0 || req.requestedBooks.length === 0) {
			requests.splice(i, 1);
		}
	}

	fs.writeFileSync('src/lib/data/requests.json', JSON.stringify(requests, null, 2));

	return new Response(JSON.stringify({ trade: newTrade }), { status: 201 });
}