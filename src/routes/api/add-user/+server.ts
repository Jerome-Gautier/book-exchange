import users from '$lib/data/users.json';

import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
    let newUser = await request.json();
    newUser = newUser.user;

    if (!newUser) {
        return new Response(JSON.stringify({ error: 'Invalid user data' }), { status: 400 });
    }

    let user = users.find(u => u.email === newUser.email);
    if (user && user.id) {
        return new Response(JSON.stringify({ user }), { status: 409 });
    } else if (newUser.email) {
        user = {
            id: (users.length + 1).toString(),
            username: newUser.name,
            fullname: newUser.name,
            email: newUser.email,
            location: 'Unknown',
            books: [],
        };

        users.push(user);
        fs.writeFileSync(
            path.resolve('src/lib/data/users.json'),
            JSON.stringify(users, null, 2),
            'utf-8'
        );
    }
    
    return new Response(JSON.stringify({ success: true, user }), { status: 201 });
}