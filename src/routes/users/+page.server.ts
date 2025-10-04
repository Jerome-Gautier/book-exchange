export async function load({ fetch }) {
    const response = await fetch('/api/users');

    const data = await response.json();

    return {
        users: data.users || []
    }
}