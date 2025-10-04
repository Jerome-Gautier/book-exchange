export async function load({ params, fetch, cookies }) {
	const userId = params.id;
	const selection = JSON.parse(cookies.get('requestedBooks') || '[]');

	const response = await fetch(`/api/users/${userId}/books`);

	const data = await response.json();
	
	return {
		user: data.user,
		books: data.books,
		selection,
	};
}