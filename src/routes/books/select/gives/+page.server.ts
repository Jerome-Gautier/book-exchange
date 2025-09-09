export async function load({ cookies, fetch, locals }) {
    const session = await locals.auth();
    const offeredBooks = JSON.parse(cookies.get('offeredBooks') || '[]');

	const userId = session?.user?.id;

	const response = await fetch(`/api/users/${userId}/get-books`);

	const data = await response.json();

	const user = data.user || null;

	if (!user) {
		return {
			status: 404,
			error: new Error('User not found')
		};
	}

	return {
		selection: offeredBooks,
		user
	}
}