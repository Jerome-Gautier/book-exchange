import mongoose from 'mongoose';
import '$db/models/Request'; // register Request model for virtual populate

const BookSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		author: { type: String, required: true },
		condition: { type: String, default: null },
		ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
	},
	{
		toObject: {
			virtuals: true,
			transform(_doc: any, ret: any) {
				// remove the populated requests payload from JSON output
				delete ret.requests;
				return ret;
			}
		},
		toJSON: {
			virtuals: true,
			transform(_doc: any, ret: any) {
				delete ret.requests;
				return ret;
			}
		},
		id: false
	}
);

BookSchema.virtual('ownerDetails', {
	ref: 'User',
	localField: 'ownerId',
	foreignField: '_id',
	justOne: true
});

// virtual populate: keep minimal request data (used only to compute counts/requesters)
BookSchema.virtual('requests', {
	ref: 'Request',
	localField: '_id',
	foreignField: 'requestedBooks.book',
	justOne: false
});

// computed: total appearances of this book in all requestedBooks
BookSchema.virtual('requestCount').get(function (this: any) {
	if (!this.requests || !Array.isArray(this.requests)) return 0;
	let count = 0;
	for (const req of this.requests) {
		if (!Array.isArray(req.requestedBooks)) continue;
		for (const rb of req.requestedBooks) {
			const bid = rb && (rb.book?._id ?? rb.book);
			if (String(bid) === String(this._id)) count++;
		}
	}
	return count;
});

// computed: unique list of requesters (id  username)
BookSchema.virtual('requesters').get(function (this: any) {
	if (!this.requests || !Array.isArray(this.requests)) return [];
	const map = new Map<string, { id: string; username: string | null }>();
	for (const req of this.requests) {
		const from = req.fromUser;
		if (!from) continue;
		const uid = String(from._id ?? from);
		if (!map.has(uid)) map.set(uid, { id: uid, username: from.username ?? null });
	}
	return Array.from(map.values());
});

// auto-populate minimal request fields so virtuals can compute without exposing full requests
function autoPopulateRequests(this: any, next: any) {
	this.populate([
		{
			path: 'requests',
			select: 'fromUser requestedBooks', // minimal
			populate: { path: 'fromUser', select: 'username' }
		},
		{
			path: 'ownerDetails',
			select: 'username fullname location'
		}
	]);
	next();
}

BookSchema.pre('find', autoPopulateRequests);
BookSchema.pre('findOne', autoPopulateRequests);
BookSchema.pre('findOneAndUpdate', autoPopulateRequests);
// ...existing code...
export default mongoose.models.Book || mongoose.model('Book', BookSchema);
