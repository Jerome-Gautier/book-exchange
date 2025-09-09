export async function load({ cookies, fetch }) {
	const offeredBooksIds = JSON.parse(cookies.get('offeredBooks') || '[]');
	const requestedBooksIds = JSON.parse(cookies.get('requestedBooks') || '[]');

	let obData = [];
	let rbData = [];
	if (offeredBooksIds.length > 0) {
		let offeredBooksUrl = '/api/books?';
		for (const bookId of offeredBooksIds) {
			offeredBooksUrl += `id=${bookId}&`;
		}
		offeredBooksUrl = offeredBooksUrl.slice(0, -1);

		const obResponse = await fetch(offeredBooksUrl);
		obData = await obResponse.json();
	}
	if (requestedBooksIds.length > 0) {
		let requestedBooksUrl = '/api/books?';
		for (const bookId of requestedBooksIds) {
			requestedBooksUrl += `id=${bookId}&`;
		}
		requestedBooksUrl = requestedBooksUrl.slice(0, -1);

		const rbResponse = await fetch(requestedBooksUrl);

		rbData = await rbResponse.json();
	}

	// Fetch complete data from DB or API
	return { offeredBooks: obData.availableBooks, requestedBooks: rbData.availableBooks };
}
