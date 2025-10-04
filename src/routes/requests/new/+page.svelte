<script lang="ts">
    import { page } from "$app/state";
	import type { Book } from "$lib/models/models";

    const { data } = $props();

    const offeredBooks = data.offeredBooks || [];
    const requestedBooks = data.requestedBooks || [];

    const session = page.data.session;

    const handleSubmit = async () => {
        const reqObject = {
            fromUser: session?.user?.id,
            offeredBooks: offeredBooks.map((b: Book) => b._id),
            requestedBooks: requestedBooks.map((b: any) => {
                return {
                    book: b._id,
                    owner: b.ownerId
                }
            })
        }

        const response = await fetch('/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqObject)
        });

        if (response.status === 201) {
            // Clear cookies
            await fetch('/api/set-requests-cookies', {
                method: 'DELETE'
            });
            // Redirect to user's requests page
            window.location.href = `/requests`;
        } else {
            alert('Failed to create request. Please try again.');
        }
    }
</script>

<div class="max-w-4xl mx-auto mt-12 bg-gray-100 rounded-lg shadow-lg p-8 border border-gray-200">
    <h1 class="text-2xl font-bold text-gray-800 text-center mb-8">Create new Trade Request</h1>
    <div>
        {#if session && session.user}
        <div class="bg-white border border-gray-300 rounded p-4 mb-4">
                <div class="flex flex-row">
                    <!-- Gives -->
                    <div class="flex flex-col w-1/2 pr-4 border-r border-gray-300">
                        <div class="mb-2">
                            <a href={`/users/${session.user.id}`} class="text-blue-600 hover:underline font-medium">{session.user.name}</a>
                            <span class="text-gray-600"> wants to give:</span>
                        </div>
                        {#if offeredBooks.length > 0}
                            {#each offeredBooks as book}
                            <div class="bg-white border border-gray-200 rounded p-3 text-orange-500">
                                <div class="font-semibold">{book.title}</div>
                                <div>{book.author}</div>
                            </div>
                            {/each}
                        {/if}
                        <a href="/books/select/gives" class="w-[150px] py-2 text-center bg-white text-black border border-gray-200 rounded hover:bg-gray-100 cursor-pointer">Edit Books to Give</a>
                    </div>
                    <!-- Takes -->
                    <div class="flex flex-col w-1/2 pl-4">
                        <div class="mb-2">
                            <span class="text-gray-600">and wants to take:</span>
                        </div>
                        {#if requestedBooks.length > 0}
                            {#each requestedBooks as book, i}
                            <div>
                                <div class="bg-white border border-gray-200 rounded p-3">
                                    {#if book.requestsCount}
                                    <a href={`/books/${book.id}/requests`} class="float-right text-blue-600 hover:underline text-sm font-medium">
                                        Requests
                                        <span class="ml-1 bg-gray-700 text-white text-xs px-2 rounded-full">{book.requestsCount}</span>
                                    </a>
                                    {/if}
                                    <div class="font-semibold">{book.title}<span class="text-sm font-light ml-1">from <a href={`/users/${book.ownerId}`} class="text-blue-600 hover:underline">{book.ownerDetails.username}</a></span></div>
                                    <div class="text-gray-600">{book.author}</div>
                                </div>
                            </div>
                            {/each}
                        {/if}
                        <a href="/books/select/takes" class="w-[150px] py-2 text-center bg-white text-black border border-gray-200 rounded hover:bg-gray-100 cursor-pointer">Edit Books to Take</a>
                    </div>
                </div>
            </div>
        {/if}
    </div>
    <button onclick={handleSubmit} class="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">Submit Request</button>
</div>