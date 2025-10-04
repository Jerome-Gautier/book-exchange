<script lang="ts">
	import RequestBtn from '$lib/components/request-btn.svelte';
	import RequestsDisplay from '$lib/components/requestsDisplay.svelte';
	import type { Book } from '$lib/models/models.js';

    let { data } = $props();
    const availableBooks = data.availableBooks || [];
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

<div class="max-w-4xl m-8 border-2 border-gray-300 mx-auto">
    <RequestBtn {selection} />
    <div class="text-center w-full py-4 bg-gray-200">
        <h1 class="text-4xl">Books <span class="text-xl">available for trade</span></h1>
    </div>
    <div>
        {#each availableBooks as book}
        <div class="flex flex-row items-center justify-between p-4 border-b border-gray-300">
            <div class="flex flex-row items-center justify-start">
                <input onclick={() => toggleBook(book)} type="checkbox" class="form-checkbox h-5 w-5 text-blue-600" checked={selection.includes(book._id)} />
                <div class="p-4">
                    <h2 class="text-xl font-semibold">{book.title}</h2>
                    <p class="text-gray-700">Author: {book.author}</p>
                    <p class="text-gray-700">Condition: {book.condition}</p>
                    <p class="text-gray-500">from <a class="text-blue-500 hover:text-blue-800" href={`/users/${book.ownerId}`}>{book.ownerDetails.username}</a> in {book.ownerDetails.location}</p>
                </div>
            </div>
            <RequestsDisplay bookId={book._id} requestCount={book.requestCount} requesters={book.requesters} />
        </div>
        {/each}
    </div>
</div>