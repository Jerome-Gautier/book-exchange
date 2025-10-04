export async function load({ cookies, fetch, locals }) {
    const session = await locals.auth();
    const offeredBooks = JSON.parse(cookies.get('offeredBooks') || '[]');

	const userId = session?.user?.id;

	const response = await fetch(`/api/users/${userId}/books`);

	const data = await response.json();

	const { user, books } = data || null;

	if (!user || !books) {
		return {
			status: 404,
			error: 'Data not found'
		};
	}

	return {
		selection: offeredBooks,
		user,
		books
	}
}