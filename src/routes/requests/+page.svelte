<script lang="ts">
	let { data } = $props();
    const requests = data.requests || [];

    const userId = data.userId;

    const handleDelete = async (requestId: number) => {
        const requestObject = {
            userId,
            requestId
        }

        const response = await fetch(`/api/requests/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestObject),
        });

        if (response.ok) {
            // Refresh the page or remove the request from the list
            window.location.reload();
        } else {
            alert('Failed to delete request. Please try again.');
        }
    }
</script>

<div class="max-w-4xl m-8 border-2 border-gray-300 mx-auto">
    <div class="text-center w-full py-4 bg-gray-200">
        <h1 class="text-4xl">All Requests</h1>
    </div>
    <div>
        {#each requests as request}
            <div class="relative bg-gray-100 border border-gray-300 rounded p-4 m-4">
                {#if userId === request.fromUser.id}
                    <button onclick={() => handleDelete(request.id)} class="absolute top-2 right-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition font-semibold text-sm">Cancel request</button>
                {/if}
                <div class="flex flex-row">
                    <!-- Gives -->
                    <div class="w-1/2 pr-4 border-r border-gray-300">
                        <div class="mb-2">
                            <a href={`/users/${request.fromUser.id}`} class="text-blue-600 hover:underline font-medium">{request.fromUser.username}</a>
                            <span class="text-gray-600"> wants to give:</span>
                        </div>
                        {#if request.offeredBooks}
                            {#each request.offeredBooks as book}
                            <div class="bg-white border border-gray-200 rounded p-3">
                                <div class="font-semibold">{book.title}</div>
                                <div class="text-gray-600">{book.author}</div>
                            </div>
                            {/each}
                        {/if}
                    </div>
                    <!-- Takes -->
                    <div class="w-1/2 pl-4">
                        <div class="mb-2">
                            <span class="text-gray-600">and wants to take:</span>
                        </div>
                        {#each request.requestedBooks as book, i}
                        {#if book}
                        <div>
                            <div class="bg-white border border-gray-200 rounded p-3">
                                {#if book.incomingRequests > 0}
                                    <a href={`/books/${book.id}/requests`} class="float-right"><span class="text-blue-500 hover:text-blue-800 font-semibold">Requests</span> <span class="bg-black text-white px-2 rounded-full">{book.incomingRequests}</span></a>
                                {/if}
                                {#if book.requestsCount && request.offeredBook}
                                <a href={`/books/${request.offeredBook.id}/requests`} class="float-right text-blue-600 hover:underline text-sm font-medium">
                                    Requests
                                    <span class="ml-1 bg-gray-700 text-white text-xs px-2 rounded-full">{book.requestsCount}</span>
                                </a>
                                {/if}
                                <div class="font-semibold">{book.title} <span class="text-gray-400 text-sm">from</span> <a href={`/users/${book.ownerId}`} class="text-blue-500 text-sm">{book.ownerUsername}</a></div>
                                <div class="text-gray-600">{book.author}</div>
                            </div>
                        </div>
                        {/if}
                        {/each}
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>