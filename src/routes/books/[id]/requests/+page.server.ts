export async function load({ params, fetch }) {
    const bookId = params.id;

    const response = await fetch(`/api/books/${bookId}/requests`);

    const data = await response.json();

    return {
        book: data.book,
        requests: data.requests
    }
}