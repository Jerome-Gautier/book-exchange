import type { Book, BookRequest } from "$lib/models/models";

export const reorderBooksArr = (booksArr: Book[], selectedIds: string[]) => {
	if (selectedIds.length > 0 && Array.isArray(booksArr)) {
		const selectedSet = new Set(selectedIds);
		const requestedFirst = booksArr.filter((b) => selectedSet.has(b.id));
		const others = booksArr.filter((b) => !selectedSet.has(b.id));
		
		return [...requestedFirst, ...others]
	}

    return booksArr;
};

export const countRequestedBooksForuser = (userBooksIds: string[], requests: BookRequest[]) => {
	let count = 0;
    for (const req of requests) {
        if (Array.isArray(req.requestedBooks)) {
            for (const rb of req.requestedBooks) {
                const bookId = rb.id;
                if (userBooksIds.includes(bookId)) {
                    count++;
                }
            }
        }
    }
    return count;
}

export const countIncomingRequestsForUser = (userId: string, requests: BookRequest[]) => {
    let count = 0;
    for (const req of requests) {
        if (Array.isArray(req.requestedBooks)) {
            for (const rb of req.requestedBooks) {
                if (rb.ownerId === userId) {
                    count++;
                }
            }
        }
    }
    return count;
}