import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const data = await request.json();
    cookies.set(data.name, JSON.stringify(data.selection), {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 60 * 60 * 24 * 7
    });

    return new Response(null, { status: 200 });
}

export const DELETE: RequestHandler = async ({ cookies }) => {
    cookies.delete('offeredBooks', { path: '/' });
    cookies.delete('requestedBooks', { path: '/' });
    
    return new Response(null, { status: 200 });
}