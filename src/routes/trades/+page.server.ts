import type { Trade } from '$lib/models/models';

export async function load({ fetch }) {
    const response = await fetch('/api/trades');
    if (response.status !== 200) {
        throw new Error('Failed to fetch trades');
    }

    const { trades } = await response.json();


    trades.sort((a: Trade, b: Trade) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
        trades
    }
}