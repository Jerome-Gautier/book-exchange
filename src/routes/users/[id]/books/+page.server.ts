export async function load({ fetch, params }) {
    const userId = params.id;

    
    
    const response = await fetch(`/api/books?id=${userId}`);
    if (!response.ok) {
        return {
            status: response.status,
            error: new Error('Failed to fetch user books')
        };
    }

    const data = await response.json();

    return {
        username: data.username,
        books: data.books || [],
    }
}