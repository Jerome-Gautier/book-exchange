import RequestModel from '$db/models/Request';

export async function GET({ url }) {
	const requestId = url.searchParams.get('id');
	const query = requestId ? { _id: requestId } : {};
	const requestsData = await RequestModel.find(query)
		.populate('fromUser')
		.populate('offeredBooks')
		.populate('requestedBooks.book')
		.populate('requestedBooks.owner');

	if (!requestsData) {
		return new Response(JSON.stringify({ error: 'No requests found' }), { status: 404 });
	}

	return new Response(JSON.stringify({ requests: requestsData }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

export async function POST({ request }: { request: Request }) {
	try {
		const requestData = await request.json();
		const { fromUser, offeredBooks, requestedBooks } = requestData;

		// Require basic fields (requestedBooks or requestedBooksIds required)
		if (!fromUser || requestedBooks.length < 1 || offeredBooks.length < 1) {
			return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
		}

		const newRequest = {
			fromUser,
			offeredBooks,
			requestedBooks
		};

		const created = await RequestModel.create(newRequest);
		const populatedRequest = await RequestModel.findById(created._id)
			.populate('fromUser', 'username')
			.populate('offeredBooks', 'title author location')
			.populate('requestedBooks.book', 'title author')
			.populate('requestedBooks.owner', 'username')
			.lean({ virtuals: true })
			.exec();

		return new Response(JSON.stringify({ success: true, request: populatedRequest }), {
			status: 201
		});
	} catch (error) {
		console.error('Error processing POST /api/requests:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
}

export async function DELETE({ request }: { request: Request }) {
	try {
		const requestData = await request.json();
		const { requestId } = requestData;

        if (!requestId) {
			return new Response(JSON.stringify({ error: 'requestId required' }), { status: 400 });
		}

		const deleted = await RequestModel.findByIdAndDelete(requestId).exec();
        if (!deleted) {
            return new Response(JSON.stringify({ error: 'Request not found' }), { status: 404 });
        }

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Error processing DELETE /api/requests:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
}
