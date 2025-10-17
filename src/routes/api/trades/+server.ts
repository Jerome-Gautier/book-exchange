import TradesModel from '$db/models/Trade.js';
import BookModel from '$db/models/Book.js';
import RequestModel from '$db/models/Request.js';
import mongoose from 'mongoose';

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

		console.log(data);

		const { userId, requestId, offeredBook, requestedBook } = data;

		if (!userId || !requestId || !offeredBook || !requestedBook) {
			return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
		}

		const tradeObject = {
			fromId: userId,
			toId: requestedBook.book.ownerDetails._id,
			bookGiven: {
				author: offeredBook.author,
				title: offeredBook.title,
				bookId: offeredBook._id
			},
			bookTaken: {
				author: requestedBook.book.author,
				title: requestedBook.book.title,
				bookId: requestedBook.book._id
			}
		}

		const newTrade = new TradesModel(tradeObject);		
		
		const created = await newTrade.save();

		if (!created) {
			return new Response(JSON.stringify({ error: 'Trade creation failed' }), { status: 500 });
		}

		// Cleanup: remove traded books from books collection and remove references from requests
		try {
			const bookGivenId = created.bookGiven?.bookId;
			const bookTakenId = created.bookTaken?.bookId;

			const toOid = (id: string) => (mongoose.Types.ObjectId.isValid(String(id)) ? new mongoose.Types.ObjectId(String(id)) : id);

			const bg = bookGivenId ? toOid(bookGivenId) : null;
			const bt = bookTakenId ? toOid(bookTakenId) : null;

			if (bg) {
				await BookModel.deleteOne({ _id: bg }).exec();
				// remove from offeredBooks arrays
				await RequestModel.updateMany({}, { $pull: { offeredBooks: bg } }).exec();
				// remove from requestedBooks subdocs
				await RequestModel.updateMany({}, { $pull: { requestedBooks: { book: bg } } }).exec();
			}

			if (bt) {
				await BookModel.deleteOne({ _id: bt }).exec();
				await RequestModel.updateMany({}, { $pull: { offeredBooks: bt } }).exec();
				await RequestModel.updateMany({}, { $pull: { requestedBooks: { book: bt } } }).exec();
			}

			// Remove any requests that are now empty (no offeredBooks and no requestedBooks)
			await RequestModel.deleteMany({
				$expr: { $and: [ { $eq: [ { $size: '$offeredBooks' }, 0 ] }, { $eq: [ { $size: '$requestedBooks' }, 0 ] } ] }
			}).exec();
		} catch (cleanupErr) {
			console.error('Error during post-trade cleanup:', cleanupErr);
		}

		return new Response(JSON.stringify({ trade: created }), { status: 201 });
	} catch (error) {
		console.error('Error processing POST /api/trades:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
}
