<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Book } from '$lib/models/models.js';

    let { data } = $props();

    const user = data.user;

    let books = $state(data.books || []);
    let selection = $state(data.selection || []);

    let form = $state({ title: '', author: '', condition: '' });

    const toggleBook = (book: Book) => {
        if (selection.length > 0 && selection.includes(book._id)) {
            const index = selection.findIndex((b: string) => b === book._id);
            selection.splice(index, 1);
        } else {
            selection.push(book._id);
        }
    }

    const handleAddBook = async (event: Event) => {
        event.preventDefault();
        const title = form.title;
        const author = form.author;
        const condition = form.condition;
        const userId = user?.id;

        const response = await fetch(`/api/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, author, condition, userId })
        });

        const data = await response.json();

        if (response.ok) {
            books.push(data.newBook);
            form.title = '';
            form.author = '';
            form.condition = '';
        } else {
            window.alert('Failed to add book: ' + data.error);
        }
    }

    const handleDeleteBook = async (bookId: string) => {
        const response = await fetch(`/api/books`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookId, userId: user?._id })
        });

        if (response.ok) {
            books.splice(books.findIndex((b: any) => b._id === bookId), 1);
        } else {
            console.error(`Failed to delete book with ID ${bookId}.`);
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
<div class="max-w-3xl m-8 mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Add Book for {user.username}</h2>
    <form class="flex flex-col mb-4 w-full" onsubmit={handleAddBook}>
        <div class="flex flex-row mb-2 items-center justify-center w-full">
            <label for="book-title" class="mr-4 mb-2 w-[150px] text-right">Title:</label>
            <input id="book-title" type="text" class="w-full border p-2 rounded mb-2" bind:value={form.title} />
        </div>
        <div class="flex flex-row mb-2 items-center justify-center w-full">
            <label for="author" class="mr-4 mb-2 w-[150px] text-right">Author:</label>
            <input id="author" type="text" class="w-full border p-2 rounded mb-2" bind:value={form.author} />
        </div>
        <div class="flex flex-row mb-2 items-center justify-center w-full">
            <label for="condition" class="mr-4 mb-2 w-[150px] text-right">Condition:</label>
            <input id="condition" type="text" class="w-full border p-2 rounded mb-2" bind:value={form.condition} />
        </div>
        <button type="submit" class="w-[200px] ml-[136px] bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900 transition-all transition-delay-400">Add Book to Exchange</button>
    </form>

</div>

<div class="max-w-4xl m-8 border-2 border-gray-300 mx-auto">
    <div class="text-center w-full py-4 bg-gray-200">
        <h1 class="text-4xl mx-2">{user.username}'s Books <span class="text-xl">available for trade</span></h1>
    </div>
    <div>
        {#each books as book}
            <div class="flex flex-row items-center justify-between p-4 border-b border-gray-300">
                <div class="flex flex-row items-center justify-start">
                    <div class="w-[50px] flex items-center justify-center">
                        <input onclick={() => toggleBook(book)} type="checkbox" checked={selection.includes(book._id)} class="form-checkbox h-5 w-5 text-blue-600 cursor-pointer" />
                    </div>
                    <div class="p-4">
                        <h2 class="text-xl font-semibold">{book.title}</h2>
                        <p class="text-gray-700">Author: {book.author}</p>
                        <p class="text-gray-700">Condition: {book.condition}</p>
                        <p class="text-gray-500">from <a class="text-blue-500 hover:text-blue-800" href={`/users/${user.id}`}>{user.username}</a> in {user.location}</p>
                    </div>
                </div>
                <div class="text-right flex flex-col items-end gap-2">
                    {#if book.requests && book.requests.length >= 1}
                    <a href={`/books/${book.id}/requests`}><span class="text-blue-500 hover:text-blue-800 font-semibold">Requests</span> <span class="bg-black text-white px-2 rounded-full">{book.requests.length}</span></a>
                    <p>
                        ({#each book.requests as trade, index}
                            <a class="text-blue-500 hover:text-blue-800" href={`/users/${trade.fromUser.id}`}>{trade.fromUser.username}</a>
                            {#if index < book.requests.length - 1}
                            <span class="mr-2">,</span>{/if}
                        {/each})
                    </p>
                    {/if}
                    <button
                        class="mt-2 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded transition cursor-pointer"
                        onclick={() => handleDeleteBook(book._id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        {/each}
    </div>
    <div class="pl-8">
        <button class="my-4 ml-[50px] bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded transition cursor-pointer" onclick={() => handleNewRequest()}>New Request</button>
    </div>
</div>
{/if}