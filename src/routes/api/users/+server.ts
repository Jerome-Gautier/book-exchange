import UserModel from '$db/models/User.js';

export async function GET() {
	// Aggregation: for each user compute:
	// - bookCount: number of books with ownerId === user._id
	// - incomingRequestsCount: number of Request documents that reference at least one requestedBooks.owner === user._id
	const pipeline = [
		// lookup book count
		{
			$lookup: {
				from: 'books',
				let: { uid: '$_id' },
				pipeline: [{ $match: { $expr: { $eq: ['$ownerId', '$$uid'] } } }, { $count: 'count' }],
				as: 'booksCount'
			}
		},
		// lookup incoming requests count (requests that target user's books)
		{
			$lookup: {
				from: 'requests',
				let: { uid: '$_id' },
				pipeline: [
					// keep requests that contain at least one requestedBooks.owner equal to user id
					{
						$match: {
							$expr: {
								$gt: [
									{
										$size: {
											$filter: {
												input: '$requestedBooks',
												as: 'rb',
												cond: { $eq: ['$$rb.owner', '$$uid'] }
											}
										}
									},
									0
								]
							}
						}
					},
					{ $count: 'count' }
				],
				as: 'incomingCount'
			}
		},
		// expose counts as numbers (defaults to 0)
		{
			$addFields: {
				bookCount: { $ifNull: [{ $arrayElemAt: ['$booksCount.count', 0] }, 0] },
				incomingRequestsCount: { $ifNull: [{ $arrayElemAt: ['$incomingCount.count', 0] }, 0] }
			}
		},
		// project the fields you want to return
		{
			$project: {
				_id: 1,
				username: 1,
				fullname: 1,
				email: 1,
				location: 1,
				createdAt: 1,
				updatedAt: 1,
				bookCount: 1,
				incomingRequestsCount: 1
			}
		}
	];

	try {
		const users = await UserModel.aggregate(pipeline).exec();

		return new Response(JSON.stringify({ users }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('GET /api/users aggregation error', err);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

export async function POST({ request }) {
	const newUser = await request.json();

	if (!newUser || !newUser.email) {
		return new Response(JSON.stringify({ error: 'Invalid user data' }), { status: 400 });
	}

	const createdUser = await UserModel.create(newUser);

	if (!createdUser) {
		return new Response(JSON.stringify({ error: 'Failed to create user' }), { status: 500 });
	}

	return new Response(JSON.stringify({ user: createdUser }), { status: 201 });
}

export async function PUT({ request, locals }) {
	const session = await locals.auth();

	if (!session || !session.user) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	try {
		const updatedUser = await request.json();
		const userId = session.user.id;
		if (userId !== updatedUser._id) {
			return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
		}

		const { username, fullname, email, location } = updatedUser;

		if (!username || !fullname || !email || !location) {
			return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
		}

		const user = await UserModel.findByIdAndUpdate(
			updatedUser._id,
			{
				username,
				fullname,
				email,
				location
			},
			{ new: true }
		)
			.lean()
			.exec();

		if (!user) {
			return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
		}

		return new Response(JSON.stringify({ user }), { status: 200 });
	} catch (error) {
		console.error('Error processing PUT /api/users:', error);
		return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
	}
}

export async function DELETE({ request }) {
	const { id } = await request.json();

	return new Response(JSON.stringify({ error: 'User with id ' + id + ' not found' }), {
		status: 404
	});
}