import TradesModel from '$db/models/Trade.js';

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

		const { fromUserId, toUserId, fromBooks, toBooks } = data;

		const newTrade = new TradesModel({
			fromUser: fromUserId,
			toUser: toUserId,
			bookGiven: fromBooks,
			bookTaken: toBooks
		});
		
		const created = await newTrade.save();

		return new Response(JSON.stringify({ trade: created }), { status: 201 });
	} catch (error) {
		console.error('Error processing POST /api/trades:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
}
