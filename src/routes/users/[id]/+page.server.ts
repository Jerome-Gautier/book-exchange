export async function load({ params, fetch }) {
	const userId = params.id;
	
	const response = await fetch(`/api/users/${userId}`);

	const data = await response.json();
	
	return {
		user: data.user
	};
}