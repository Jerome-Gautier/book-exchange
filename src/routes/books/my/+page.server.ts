export async function load({ cookies, locals, fetch }) {
    const session = await locals.auth();
	const selection = JSON.parse(cookies.get('offeredBooks') || '[]');

	const userId = session?.user?.id;

	const response = await fetch(`http://localhost:5173/api/users/${userId}/books`);

	const data = await response.json();

	return {
		user: data.user,
		books: data.books,
		selection,	
	};
}