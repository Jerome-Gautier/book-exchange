import BookModel from '$db/models/Book';
import UserModel from '$db/models/User';
import type { UserDocument } from '$lib/models/models.js';

export async function GET({ params }) {
	const userId = params.id;

	const userDetails = (await UserModel.findById(userId).lean().exec()) as UserDocument | null;

	if (!userDetails) {
		return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
	}

	const ownerStr = String(userDetails._id);

	const books = await BookModel.find({ ownerId: ownerStr }).lean().exec();

	return new Response(
		JSON.stringify({
			user: {
				id: String(userDetails._id),
				username: userDetails.username,
				fullname: userDetails.fullname,
				email: userDetails.email,
				location: userDetails.location,
			},
			books
		})
	);
}