export type Book = {
	id: string;
	title: string;
	author: string;
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
    status: 'available' | 'wanted' | 'pending';
    condition?: 'new' | 'like new' | 'good' | 'acceptable';
};