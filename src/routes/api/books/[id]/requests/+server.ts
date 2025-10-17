import BookModel from '$db/models/Book';
import RequestModel from '$db/models/Request';

export async function GET({ params }) {
    const bookId = params.id;

    if (!bookId) {
        return new Response(JSON.stringify({ error: 'Book ID is required' }), { status: 400 })
    }

    const book = await BookModel.findById(bookId)
        .populate('ownerId', 'username')
        .lean()
        .exec();
    
    if (!book) {
        return new Response(JSON.stringify({ error: 'Book not found'}), { status: 404 });
    }

    // fetch requests (existing single request)
    const requestsData = await RequestModel.find({ 'requestedBooks.book': bookId})
        .populate('fromUser')
        .populate('offeredBooks')
        .populate('requestedBooks.book')
        .populate('requestedBooks.owner')
        .lean()
        .exec();

    // collect unique book ids from offeredBooks and requestedBooks
    const bookIdSet = new Set<string>();
    for (const req of requestsData) {
        if (Array.isArray(req.offeredBooks)) {
            for (const ob of req.offeredBooks) {
                const id = ob && (ob._id ?? ob) ? String(ob._id ?? ob) : null;
                if (id) bookIdSet.add(id);
            }
        }
        if (Array.isArray(req.requestedBooks)) {
            for (const rb of req.requestedBooks) {
                const id = rb && rb.book && (rb.book._id ?? rb.book) ? String(rb.book._id ?? rb.book) : null;
                if (id) bookIdSet.add(id);
            }
        }
    }

    // one aggregated DB call to get all counts for those book ids
    const bookIds = Array.from(bookIdSet);
    const countsMap = await (RequestModel as any).countRequestedBooks(bookIds);

    // attach requestCount to each book entry
    for (const req of requestsData) {
        if (Array.isArray(req.offeredBooks)) {
            req.offeredBooks = req.offeredBooks.map((ob) => {
                const id = ob && (ob._id ?? ob) ? String(ob._id ?? ob) : null;
                return { ...ob, requestCount: id ? countsMap[id] ?? 0 : 0 };
            });
        }
        if (Array.isArray(req.requestedBooks)) {
            req.requestedBooks = req.requestedBooks.map((rb) => {
                const bookRef = rb && rb.book;
                const id = bookRef && (bookRef._id ?? bookRef) ? String(bookRef._id ?? bookRef) : null;
                return {
                    ...rb,
                    book: bookRef ? { ...bookRef, requestCount: id ? countsMap[id] ?? 0 : 0 } : bookRef
                };
            });
        }
    }

    return new Response(JSON.stringify({ book, requests: requestsData }), { status: 200 });
}