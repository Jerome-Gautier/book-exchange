export async function load({ fetch, cookies }) {
	const requestedBooks = JSON.parse(cookies.get('requestedBooks') || '[]');

	const response = await fetch('/api/books');	
	const { availableBooks } = await response.json();

	// normalize requestedBooks from cookie to an array of ids (supports ['b101'] or [{id:'b101'}])
	const selectedIds = Array.isArray(requestedBooks)
		? requestedBooks.map((rb) => (typeof rb === 'string' ? rb : rb && rb.id ? rb.id : null)).filter(Boolean)
		: [];

	if (selectedIds.length > 0 && Array.isArray(availableBooks)) {
		const selectedSet = new Set(selectedIds);
		const requestedFirst = availableBooks.filter((b) => selectedSet.has(b.id));
		const others = availableBooks.filter((b) => !selectedSet.has(b.id));
		return {
			availableBooks: [...requestedFirst, ...others],
			selection: requestedBooks
		};
	}

	return {
		availableBooks,
		selection: requestedBooks
	};
}