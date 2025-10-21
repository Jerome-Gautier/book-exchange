import TradesModel from '$db/models/Trade.js';
import BookModel from '$db/models/Book.js';
import RequestModel from '$db/models/Request.js';

export async function GET() {
	const trades = await TradesModel.find()
		.populate({ path: 'fromUser', select: 'username' })
		.populate({ path: 'toUser', select: 'username' });

	if (!trades) {
		return new Response(JSON.stringify({ error: 'No trades found' }), { status: 404 });
	}

	return new Response(JSON.stringify({ trades }), { status: 200 });
}

export async function POST({ request }) {
	try {
		const data = await request.json();

		const { userId, requestId, offeredBook, requestedBook } = data;

		if (!userId || !requestId || !offeredBook || !requestedBook) {
			return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
		}

		try {
			const offeredId = String(offeredBook._id);
			const requestedId = String(requestedBook.book._id);

			const idsToRemove: string[] = [offeredId, requestedId];

			await RequestModel.updateMany(
				{
					$or: [
						{ offeredBooks: { $in: idsToRemove } },
						{ 'requestedBooks.book': { $in: idsToRemove } }
					]
				},
				{
					$pull: {
						offeredBooks: { $in: idsToRemove },
						requestedBooks: { book: { $in: idsToRemove } }
					}
				}
			).exec();

			// delete any requests that are now empty (no offeredBooks AND no requestedBooks)
			await RequestModel.deleteMany({
				$expr: {
					$and: [
						{ $eq: [{ $size: { $ifNull: ['$offeredBooks', []] } }, 0] },
						{ $eq: [{ $size: { $ifNull: ['$requestedBooks', []] } }, 0] }
					]
				}
			}).exec();

			// delete the actual Book documents in a single query
			await BookModel.deleteMany({ _id: { $in: idsToRemove } }).exec();
		} catch (cleanupErr) {
			console.error('Error during post-trade cleanup:', cleanupErr);
		}

		const tradeObject = {
			fromUser: offeredBook.ownerDetails._id,
			toUser: userId,
			bookGiven: {
				author: offeredBook.author,
				title: offeredBook.title,
				ownerId: offeredBook.ownerDetails._id
			},
			bookTaken: {
				author: requestedBook.book.author,
				title: requestedBook.book.title,
				ownerId: requestedBook.book.ownerDetails._id
			}
		};

		const newTrade = new TradesModel(tradeObject);

		const created = await newTrade.save();

		if (!created) {
			return new Response(JSON.stringify({ error: 'Trade creation failed' }), { status: 500 });
		}

		return new Response(JSON.stringify({ trade: created }), { status: 201 });
	} catch (error) {
		console.error('Error processing POST /api/trades:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
}
