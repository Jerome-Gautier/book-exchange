import books from '$lib/data/books.json';

export async function load({ params, fetch }) {
    const bookId = params.id;

    const bookDetails = books.find((b) => b.id === bookId);

    const response = await fetch(`/api/requests?id=${bookId}`);
    const { requests } = await response.json();
    
    return {
        book: bookDetails,
        requests
    }
}