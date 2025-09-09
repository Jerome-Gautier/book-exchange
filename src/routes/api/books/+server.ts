/* eslint-disable @typescript-eslint/no-explicit-any */
import books from '$lib/data/books.json';
import requests from '$lib/data/requests.json';
import users from '$lib/data/users.json';

// Note: in production you'll replace these JSON imports with DB calls.

function safeClone(obj: any): any {
	return JSON.parse(JSON.stringify(obj));
}

export async function GET({ url }) {
	const bookIds = url.searchParams.getAll('id');
	let bookList = safeClone(books);

	if (bookIds.length > 0) {
		bookList = bookList.filter((b: any) => bookIds.includes(b.id));
	}

	const result = bookList.map((book: any) => {
		const owner = users.find((u: any) => u.id === book.ownerId) || null;

		const incoming = requests
			.filter((r: any) => {
				if (r?.status && r.status !== 'pending') return false;
				if (Array.isArray(r.requestedBooks)) return r.requestedBooks.some((rb: any) => rb.id === book.id);
				if (Array.isArray(r.requestedBooksId)) return r.requestedBooksId.includes(book.id);
				if (typeof r.requestedBookId === 'string') return r.requestedBookId === book.id;
				return false;
			})
			.map((r: any) => {
				const fromUserId = r.fromUserId || r.from?.userid || null;
				return {
					requestId: r.id || r.tradeId || null,
					fromUserId,
					fromUsername: users.find((u: any) => u.id === fromUserId)?.username || (r.from?.username || 'Unknown')
				};
			});

		return {
			...book,
			owner: owner
				? {
					  id: owner.id,
					  username: owner.username,
					  location: owner.location
				  }
				: null,
			incomingRequests: incoming
		};
	});

	return new Response(JSON.stringify({ availableBooks: result }), { status: 200 });
}

export async function POST({ request }) {
	// create a new book (writes to books.json in dev). Keep JSON edits minimal here.
	const data = await request.json();
	const { userId, title, author, condition = 'unknown' } = data;

	if (!userId || !title || !author) {
		return new Response(JSON.stringify({ error: 'userId, title and author required' }), { status: 400 });
	}

	const user = users.find((u) => u.id === userId);
	if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });

	// build new book object (do not mutate imported books array in-place)
	const newBook: any = {
		id: `b${Date.now()}${Math.floor(Math.random() * 10000)}`,
		title,
		author,
		condition,
		ownerId: userId,
		status: 'available'
	};

	const updatedBooks = safeClone(books) as any[];
	updatedBooks.push(newBook);

	// write file (dev only). keep this small and explicit so it's easy to replace with DB writes later.
	const fs = await import('fs');
	const path = await import('path');
	fs.writeFileSync(path.resolve('src/lib/data/books.json'), JSON.stringify(updatedBooks, null, 2));

	return new Response(JSON.stringify({ success: true, book: newBook }), { status: 200 });
}

export async function DELETE({ request }) {
	const { bookId } = await request.json();
	if (!bookId) return new Response(JSON.stringify({ error: 'bookId required' }), { status: 400 });

	const updatedBooks = (safeClone(books) as any[]).filter((b: any) => b.id !== bookId);

	let updatedRequest = safeClone(requests);
	updatedRequest = updatedRequest.map((r: any) => {
		r.offeredBooksIds = r.offeredBooksIds.filter((id: string) => id !== bookId);
		r.requestedBooks = r.requestedBooks.filter((rb: any) => rb.id !== bookId);
		return r;
	})
	.filter

	const fs = await import('fs');
	const path = await import('path');
	fs.writeFileSync(path.resolve('src/lib/data/books.json'), JSON.stringify(updatedBooks, null, 2));
	fs.writeFileSync(path.resolve('src/lib/data/requests.json'), JSON.stringify(updatedRequest, null, 2));

	return new Response(JSON.stringify({ success: true }), { status: 200 });
}