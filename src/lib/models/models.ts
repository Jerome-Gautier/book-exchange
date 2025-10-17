export type Book = {
	_id: string;
	title: string;
	author: string;
    condition: string;
    ownerId: string;
};

export type BookOwner = {
    _id: string;
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
    _id: string;
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
    _id: string;
    fromUser: string;
    offeredBooks: string[];
    requestedBooks: RequestedBook[];
}

export type OfferedBook= {
    _id: string;
    title: string;
    author: string;
    condition: string;
    ownerId: string;
    status: string;
    ownerDetails: User;
    requests: string[];
}

export type RequestedBook = {
    book: Book;
    owner: User;
}