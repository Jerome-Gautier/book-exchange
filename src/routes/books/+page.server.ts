import type { Book } from '$lib/models/models';
import { reorderBooksArr } from '$lib/utils/utils.js';

export async function load({ fetch, cookies, locals }) {
	const session = await locals.auth();
	const requestedBooks = JSON.parse(cookies.get('requestedBooks') || '[]');
	const userId = session?.user?.id;

	const response = await fetch('/api/books');	

	let { availableBooks } = await response.json();
	
	if (userId && requestedBooks.length > 0) {
		availableBooks = availableBooks.filter((book: Book) => book.ownerId !== userId);
		availableBooks = reorderBooksArr(availableBooks, requestedBooks);
	}

	return {
		availableBooks,
		selection: requestedBooks
	};
}