import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';

import { GITHUB_ID, GITHUB_SECRET, AUTH_SECRET } from '$env/static/private';

export const { handle, signIn, signOut } = SvelteKitAuth(async () => {
	const authOptions = {
		providers: [
			GitHub({
				clientId: GITHUB_ID,
				clientSecret: GITHUB_SECRET
			})
		],
		callbacks: {
			async session({ session }: { session: import('@auth/sveltekit').Session }) {
				if (session && session.user) {
					const response = await fetch('http://localhost:5173/api/add-user', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ user: session.user })
					});
					const data = await response.json();

					console.log('User added:', data);
					session.user.id = data.user.id;
				}
				return session;
			}
		},
		secret: AUTH_SECRET,
		trustHost: true
	};
	return authOptions;
});