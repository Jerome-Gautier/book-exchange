export async function load({ fetch, locals }) {
    const response = await fetch('/api/requests');
    const session = await locals.auth()
    const userId = session?.user?.id;
    
    const { requests } = await response.json();

    const sortedRequests = userId ? [...requests].sort((a, b) => {
        if (a.fromUser._id === userId && b.fromUser._id !== userId) return -1;
        if (a.fromUser._id !== userId && b.fromUser._id === userId) return 1;
        return 0;
    }) : requests;

    return {
        requests: sortedRequests || [],
        userId
    }
}