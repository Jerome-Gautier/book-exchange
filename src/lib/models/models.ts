export type Book = {
	_id: string;
	title: string;
	author: string;
    condition: string;
    ownerId: string;
};

export type BookOwner = {
    id: string;
    location: string;
    username: string;
}

export type UserDocument = {
    _id: unknown;
    username: string;
    fullname: string;
    email: string;
    location: string;
};

export type User = {
    id: string;
    username: string;
    fullname: string;
    email: string;
    location: string;
    books: UserBook[];
};

export type UserBook = {
    bookId: string;
    status: 'available' | 'wanted';
    condition: string;
};

export type BookRequest = {
    id: string;
    fromUserId: string;
    offeredBooksIds: string[];
    requestedBooks: RequestedBook[];
    createdAt: string;
}

export type RequestedBook = {
    id: string;
    ownerId: string;
}