import type { LayoutServerLoad } from './$types';

import RequestModel from '$db/models/Request.js';
import mongoose from 'mongoose';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	let requestsCount;

	if (session?.user?.id) {
		try {
			const userId = session.user.id;
			const oid = mongoose.Types.ObjectId.isValid(userId)
				? new mongoose.Types.ObjectId(userId)
				: null;

			const matchField = oid ? oid : userId;
			const agg = await RequestModel.aggregate([
				{ $unwind: '$requestBooks' },
				{ $match: { 'requestedBooks.owner': matchField } },
				{ $group: { _id: '$requestedBooks.book' } },
				{ $count: 'count' }
			]).exec();

			requestsCount = (agg[0] && agg[0].count) || 0;
		} catch (err) {
			console.error('Error counting incoming requests', err);
			requestsCount = 0;
		}
	}
  
	return {
		session,
		requestsCount
	};
};
