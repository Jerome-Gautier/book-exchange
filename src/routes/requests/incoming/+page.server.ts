export async function load({ fetch, locals }) {
    const session = await locals.auth();

    if (!session?.user?.id) {
        throw new Error('User not authenticated');
    }

    const response = await fetch('/api/requests/incoming?userId=' + session.user.id);

    if (response.status !== 200) {
        throw new Error('Failed to fetch incoming requests');
    }

    const { requests } = await response.json();

    return {
        userId: session.user.id,
        incomingRequests: requests || []
    }
}