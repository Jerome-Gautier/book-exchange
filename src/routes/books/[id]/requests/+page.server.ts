export async function load({ params, fetch }) {
    const bookId = params.id;

    const response = await fetch(`/api/books/${bookId}/requests`);

    const data = await response.json();
    console.log(data.book);

    return {
        book: data.book,
        requests: data.requests
    }
}