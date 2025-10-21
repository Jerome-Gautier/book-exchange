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
    city: string;
    state: string;
};

export type User = {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    city: string;
    state: string;
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
    offeredBooks: OfferedBook[];
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

export type Trade = {
    _id: string;
    fromUser: string;
    toUser: string;
    bookGiven: {
        title: string;
        author: string;
        ownerId: string;
    };
    bookTaken: {
        title: string;
        author: string;
        ownerId: string;
    };
    createdAt: string;
    updatedAt: string;
};