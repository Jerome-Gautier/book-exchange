import users from '$lib/data/users.json';

export function load({ params }) {
	const userId = params.id;
	const user = users.find((u) => u.id === userId);
	if (!user) {
		return {
			status: 404,
			error: 'User not found' // Use a string instead of Error object
		};
	}

	return {
		user
	};
}