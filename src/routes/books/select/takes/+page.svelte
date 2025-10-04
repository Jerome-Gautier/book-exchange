<script lang="ts">
	import { goto } from '$app/navigation';

    let { data } = $props();

    const { availableBooks } = data;

    let selection = $state(data.selection || []);

    const toggleBook = (book: any) => {
        if (selection.length > 0 && selection.find((b: any) => b === book._id)) {
            const index = selection.findIndex((b: any) => b === book._id);
            selection.splice(index, 1);
        } else {
            selection.push(book._id);
        }
    }

    const handleNewRequest = async () => {
        if (selection.length === 0) {
            alert('Please select at least one book to offer.');
            return;
        }

        const response = await fetch('/api/set-requests-cookies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name: 'requestedBooks',
                selection
            })
        });

        if (response.status === 200) {
            goto(`/requests/new`);
        }
    }
</script>

<div class="relative max-w-4xl m-8 border-2 border-gray-300 mx-auto">
    <button
        class="fixed right-1/4 bottom-8 -translate-x-1/2 bg-gray-500 hover:bg-gray-700 text-white px-6 py-3 rounded shadow-lg transition cursor-pointer z-50"
        onclick={handleNewRequest}
    >
        Continue
    </button>
    <div class="text-center w-full py-4 bg-gray-200">
        <h1 class="text-4xl mx-2">Select Books to Take <span class="text-xl">select what to trade</span></h1>
    </div>
    <div>
        {#each availableBooks as book}
            <div class="flex flex-row items-center justify-between p-4 border-b border-gray-300">
                <div class="flex flex-row items-center justify-start">
                    <div class="w-[50px] flex items-center justify-center">
                        <input onclick={() => toggleBook(book)} type="checkbox" class="form-checkbox h-5 w-5 text-blue-600 cursor-pointer" checked={selection.includes(book._id)} />
                    </div>
                    <div class="p-4">
                        <h2 class="text-xl font-semibold">{book.title}</h2>
                        <p class="text-gray-700">Author: {book.author}</p>
                        <p class="text-gray-700">Condition: {book.condition}</p>
                        <p class="text-gray-500">from <a class="text-blue-500 hover:text-blue-800" href={`/users/${book.ownerDetails._id}`}>{book.ownerDetails.username}</a> in {book.ownerDetails.location}</p>
                    </div>
                </div>
                <div class="text-right flex flex-col items-end gap-2">
                    {#if book.requests && book.requests.length >= 1}
                    <a href={`/books/${book._id}/requests`}><span class="text-blue-500 hover:text-blue-800 font-semibold">Requests</span> <span class="bg-black text-white px-2 rounded-full">{book.requests.length}</span></a>
                    <p>
                        ({#each book.requests as trade, index}
                            <a class="text-blue-500 hover:text-blue-800" href={`/users/${trade.fromUser._id}`}>{trade.fromUser.username}</a>
                            {#if index < book.requests.length - 1}
                            <span class="mr-2">,</span>{/if}
                        {/each})
                    </p>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>