export async function load({ fetch }) {
    const response = await fetch('/api/trades');
    if (response.status !== 200) {
        throw new Error('Failed to fetch trades');
    }

    const { trades } = await response.json();

    return {
        trades
    }
}