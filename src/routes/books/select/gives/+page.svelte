<script lang="ts">
	import { goto } from '$app/navigation';

    let { data } = $props();

    const { user, books } = data;
    let selection = $state(data.selection);

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
                name: 'offeredBooks',
                selection
            })
        });

        if (response.status === 200) {
            goto(`/requests/new`);
        }
    }
</script>

{#if user}
<div class="max-w-4xl m-8 border-2 border-gray-300 mx-auto">
    <div class="text-center w-full py-4 bg-gray-200">
        <h1 class="text-4xl mx-2">{user.username}'s Books <span class="text-xl">available for trade</span></h1>
    </div>
    <div>
        {#each books as book}
            <div class="flex flex-row items-center justify-between p-4 border-b border-gray-300">
                <div class="flex flex-row items-center justify-start">
                    <div class="w-[50px] flex items-center justify-center">
                        <input onclick={() => toggleBook(book)} type="checkbox" class="form-checkbox h-5 w-5 text-blue-600 cursor-pointer" checked={selection.includes(book._id)} />
                    </div>
                    <div class="p-4">
                        <h2 class="text-xl font-semibold">{book.title}</h2>
                        <p class="text-gray-700">Author: {book.author}</p>
                        <p class="text-gray-500">from <a class="text-blue-500 hover:text-blue-800" href={`/users/${user._id}`}>{user.username}</a> in {user.location}</p>
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
    <div class="pl-8">
        <button class="my-4 ml-[50px] bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded transition cursor-pointer" onclick={() => handleNewRequest()}>New Request</button>
    </div>
</div>
{/if}