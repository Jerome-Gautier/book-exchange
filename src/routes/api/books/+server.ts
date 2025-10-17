import BookModel from '$db/models/Book';

import mongoose from 'mongoose';

export async function GET({ url }) {
    const ids = url.searchParams.getAll('id');
    const match = ids.length > 0
        ? { _id: { $in: ids.filter((id) => mongoose.Types.ObjectId.isValid(id)).map((id) => new mongoose.Types.ObjectId(id)) } }
        : {};

    try {
        const books = await BookModel.find(match);

        return new Response(JSON.stringify({ availableBooks: books }), { status: 200 });
    } catch (err) {
        console.error('GET /api/books error', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}

export async function POST({ request }) {
    const newBook = await request.json();

    if (!newBook || !newBook.title || !newBook.author || !newBook.ownerId) {
        return new Response(JSON.stringify({ error: 'Missing required book data' }), { status: 400 });
    }
    const createdBook = await BookModel.create(newBook);

    if (!createdBook) {
        return new Response(JSON.stringify({ error: 'Failed to create book' }), { status: 500 });
    }

    return new Response(JSON.stringify({ book: createdBook }), { status: 201 });
}

export async function DELETE({ request }) {
	const { bookId } = await request.json();
	if (!bookId) return new Response(JSON.stringify({ error: 'bookId required' }), { status: 400 });

	const deletedBook = await BookModel.findByIdAndDelete(bookId).exec();

	if (!deletedBook) {
		return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
	}

	return new Response(JSON.stringify({ success: true, deletedBook }), { status: 200 });
}