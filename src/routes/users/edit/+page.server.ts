export async function load({ fetch, locals }) {
    const session = await locals.auth();
    
    if(!session || !session.user) {
        return {
            user: null
        }
    }

    const response = await fetch(`/api/users/${session.user.id}`);
    
    const data = await response.json();

    return {
        user: data.user
    };
}