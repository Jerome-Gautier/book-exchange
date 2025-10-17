<script lang="ts">
	import RequestBtn from '$lib/components/request-btn.svelte';
import type { Book } from '$lib/models/models.js';

    let { data } = $props();

    const { user, books } = data;
    const selection = $state(data.selection || []);

    const toggleBook = (book: Book) => {
        const index = selection.indexOf(book._id);
        if (index === -1) {
            selection.push(book._id);
        } else {
            selection.splice(index, 1);
        }
    }
</script>

{#if user}
<div class="relative max-w-4xl m-8 border-2 border-gray-300 mx-auto">
    <RequestBtn {selection} />
    <div class="text-center w-full py-4 bg-gray-200">
        <h1 class="text-4xl">{user.username}'s Books <span class="text-xl">available for trade</span></h1>
    </div>
    <div>
        {#if books.length === 0}
            <div class="p-8 text-center">
                <p class="text-gray-600">This user has not listed any books for trade yet.</p>
            </div>
        {/if}
        {#each books as book}
        <div class="flex flex-row items-center justify-between p-4 border-b border-gray-300">
            <div class="flex flex-row items-center justify-start">
                <input onclick={() => toggleBook(book)} type="checkbox" checked={selection.includes(book._id)} class="form-checkbox h-5 w-5 text-blue-600" />
                <div class="p-4">
                    <h2 class="text-xl font-semibold">{book.title}</h2>
                    <p class="text-gray-700">Author: {book.author}</p>
                    <p class="text-gray-500">from <a class="text-blue-500 hover:text-blue-800" href={`/users/${user.id}`}>{user.username}</a> in {user.location}</p>
                </div>
            </div>
            <div class="text-right">
                {#if book.requests && book.requests.length >= 1}
                <a href={`/books/${book._id}/requests`}><span class="text-blue-500 hover:text-blue-800 font-semibold">Requests</span> <span class="bg-black text-white px-2 rounded-full">{book.requests.length}</span></a>
                <p>
                    ({#each book.requests as trade, index}
                        <a class="text-blue-500 hover:text-blue-800" href={`/users/${trade.fromUser._id}`}>
                            {trade.fromUser.username}
                        </a>{#if index < book.requests.length - 1}<span class="mr-1">,</span>{/if}
                    {/each})
                </p>
                {/if}
            </div>
        </div>
        {/each}
    </div>
</div>
{/if}