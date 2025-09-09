import books from '$lib/data/books.json';
import requests from '$lib/data/requests.json'
import users from '$lib/data/users.json';

import fs from 'fs';

import type { BookRequest } from '$lib/models/models.js';
import { countRequestedBooksForuser } from '$lib/utils/utils.js';

export function GET({ url }) {
	const userId = url.searchParams.get('id');

	if (userId && userId.length > 0) {
		const user = users.find((u) => u.id === userId);
		const userBooks = books.filter((b) => b.ownerId === userId);
		return new Response(JSON.stringify({ user, books: userBooks }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} else {
		const userList = users.map((u) => {
			const userBookIds = books.filter((b) => b.ownerId === u.id).map((b) => b.id);
			const incomingRequests = countRequestedBooksForuser(userBookIds, requests as BookRequest[]);

			return {
				id: u.id,
				username: u.username,
				email: u.email,
				location: u.location,
				booksAmount: books.filter((b) => b.ownerId === u.id).length,
				incomingRequests
			};
		});

		return new Response(JSON.stringify({ users: userList }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}

export async function POST({ request }) {
	const newUser = await request.json();
	newUser.id = `user-${Date.now()}`;
	users.push(newUser);
	fs.writeFileSync('src/lib/data/users.json', JSON.stringify(users, null, 2));
	return new Response(JSON.stringify({ user: newUser }), { status: 201 });
}

export async function PUT({ request }) {
	const updatedUser = await request.json();

	const { username, fullname, email, location } = updatedUser;

	if (!username || !fullname || !email || !location) {
		return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
	}

	const index = users.findIndex((u) => u.id === updatedUser.id);
	if (index !== -1) {
		users[index] = updatedUser;
		fs.writeFileSync('src/lib/data/users.json', JSON.stringify(users, null, 2));
		return new Response(JSON.stringify({ user: updatedUser }), { status: 200 });
	}
	return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
}

export async function DELETE({ request }) {
	const { id } = await request.json();
	const index = users.findIndex((u) => u.id === id);
	if (index !== -1) {
		users.splice(index, 1);
		fs.writeFileSync('src/lib/data/users.json', JSON.stringify(users, null, 2));
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	}
	return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
}