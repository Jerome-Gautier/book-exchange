export async function load({ fetch }) {
	const response = await fetch('/api/books');

	if (!response.ok) {
		return {
			status: response.status,
			error: new Error('Failed to fetch books')
		};
	}

	const data = await response.json();

	return {
		availableBooks: data.availableBooks
	};
}