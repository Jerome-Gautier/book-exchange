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
			// count incoming requests weighted by how many offeredBooks each request contains
			// (one Request with N offeredBooks and M requestedBooks that target the user should count as N for each matching requestedBook)
			const agg = await RequestModel.aggregate([
				{ $unwind: '$requestedBooks' },
				// compute offeredCount on the parent request
				{ $addFields: { offeredCount: { $size: { $ifNull: ['$offeredBooks', []] } } } },
				{ $match: { 'requestedBooks.owner': matchField } },
				// sum offeredCount so each matching requestedBook contributes offeredCount
				{ $group: { _id: null, count: { $sum: '$offeredCount' } } }
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
