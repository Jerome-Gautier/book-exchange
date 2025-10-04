import type { RequestEvent } from '@sveltejs/kit';
import UserModel from '../../../../db/models/User';
import type { UserDocument } from '$lib/models/models';

export async function POST({ request }: RequestEvent) {
    const payload = await request.json();
    const newUser = payload?.user || payload;

    if (!newUser || !newUser.email) {
        return new Response(JSON.stringify({ error: 'Invalid user data' }), { status: 400 });
    }

    // Check for existing user by email
    const existing = await UserModel.findOne({ email: newUser.email }).lean().exec() as UserDocument | null;
    if (existing) {
        return new Response(JSON.stringify({ user: {
            id: String(existing._id),
            username: existing.username,
            fullname: existing.fullname,
            email: existing.email,
            location: existing.location
        } }), { status: 409 });
    }

    // create user
    const created = await UserModel.create({
        username: newUser.name || newUser.username,
        fullname: newUser.fullname || 'Unknown',
        email: newUser.email,
        location: newUser.location || 'Unknown'
    });

    // return created user (normalize id to string)
    const userOut = {
        id: String(created._id),
        username: created.username,
        fullname: created.fullname,
        email: created.email,
        location: created.location
    };

    return new Response(JSON.stringify({ success: true, user: userOut }), { status: 201 });
}