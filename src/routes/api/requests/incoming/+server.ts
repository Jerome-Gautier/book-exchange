import RequestModel from '$db/models/Request';

export async function GET({ url }) {
    const userId = url.searchParams.get('userId');

    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    const requestsData = await RequestModel.find({ 'requestedBooks.owner': userId })
        .populate('fromUser')
        .populate('offeredBooks')
        .populate('requestedBooks.book')
        .populate('requestedBooks.owner')
        .lean()
        .exec();

    return new Response(JSON.stringify({ requests: requestsData }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}