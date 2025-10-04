import UserModel from '$db/models/User.js'

export async function GET({ params }) {
    const userId = params.id;

    const user = await UserModel.findById(userId).lean().exec();

    if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
}