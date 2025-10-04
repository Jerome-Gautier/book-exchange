import mongoose from 'mongoose';
import './Book';
import './User';

const RequestedBookSubSchema = new mongoose.Schema(
	{
		book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
	},
	{ _id: false }
);

const RequestSchema = new mongoose.Schema(
	{
		fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		offeredBooks: { type: [mongoose.Schema.Types.ObjectId], ref: 'Book', default: [] },
		requestedBooks: { type: [RequestedBookSubSchema], default: [] }
		},
		{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
	);

// Use the MongoDB ObjectId timestamp as the canonical createdAt
RequestSchema.virtual('createdAt').get(function (this) {
	if (this._id && this._id.getTimestamp) {
		return this._id.getTimestamp().toISOString();
	}
	return undefined;
});

RequestSchema.statics.countRequestedBooks = async function (bookIds: (string | mongoose.Types.ObjectId)[]) {
    const ids = (bookIds || [])
        .filter(Boolean)
        .map((id) => (mongoose.Types.ObjectId.isValid(String(id)) ? new mongoose.Types.ObjectId(String(id)) : null))
        .filter(Boolean);

    if (!ids.length) return {};

    const pipeline = [
        { $unwind: '$requestedBooks' },
        { $match: { 'requestedBooks.book': { $in: ids } } },
        { $group: { _id: '$requestedBooks.book', count: { $sum: 1 } } }
    ];

    const agg: { _id: any; count: number }[] = await (this as any).aggregate(pipeline).exec();
    const map: Record<string, number> = {};
    for (const e of agg) map[String(e._id)] = e.count;
    return map;
};

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);