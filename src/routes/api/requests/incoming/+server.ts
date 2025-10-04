export async function GET({ url }) {
    const userId = url.searchParams.get('userId');

    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    return new Response(JSON.stringify({ requests: [] }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}