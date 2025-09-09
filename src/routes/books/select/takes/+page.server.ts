import type { Book } from '$lib/models/models';
import { reorderBooksArr } from '$lib/utils/utils.js';

export async function load({ cookies, fetch, locals }) {
    const session = await locals.auth();
    const requestedBooks = JSON.parse(cookies.get('requestedBooks') || '[]');

    const userId = session?.user?.id;

    const response = await fetch('/api/books');	
	let { availableBooks } = await response.json();


    availableBooks = availableBooks.filter((book: Book) => book.ownerId !== userId);
    availableBooks = reorderBooksArr(availableBooks, requestedBooks);

    return {
        availableBooks,
        selection: requestedBooks        
    };
}