export async function load(event) {
    const session = await event.locals.auth();

	const userId = session?.user?.id;

	const response = await fetch(`http://localhost:5173/api/users/${userId}/get-books`);

	const data = await response.json();

	return {
		user: data.user,
	};
}