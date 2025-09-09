import { dev } from '$app/environment';
import { redirect, type Handle } from '@sveltejs/kit';
import { handle as authenticationHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';

const restrictedRoutes = ['/books/my','/users/edit', '/requests/incoming'];

const handleDevtools: Handle = async ({ event, resolve }) => {
    if (dev && event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
        return new Response(undefined, { status: 404 });
    }

    return resolve(event);
}

const authorizationHandle: Handle = async ({ event, resolve}) => {
    const session = await event.locals.auth();

    if (restrictedRoutes.some(route => event.url.pathname.startsWith(route))) {
        if (!session) {
            throw redirect(303, '/users/login');
        }
    }

    if (event.url.pathname === '/users/login' && session){
        throw redirect(303, '/books');
    }
    return resolve(event);
}

export const handle: Handle = sequence(handleDevtools, authenticationHandle, authorizationHandle);