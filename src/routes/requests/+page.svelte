<script lang="ts">
	import RequestsDisplay from '$lib/components/requestsDisplay.svelte';

	let { data } = $props();
    const requests = $state(data.requests);

    const userId = data.userId;

    const handleDelete = async (requestId: number, index: number) => {
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
            requests.splice(index, 1);
            //window.location.reload();
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
        {#each requests as request, index}
            <div class="relative bg-gray-100 border border-gray-300 rounded p-4 m-4">
                {#if userId === request.fromUser._id}
                    <button onclick={() => handleDelete(request._id, index)} class="absolute top-2 right-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition font-semibold text-sm">Cancel request</button>
                {/if}
                <div class="flex flex-col lg:flex-row lg:gap-0 gap-4">
                    <!-- Gives -->
                    <div class="lg:w-1/2 w-full lg:pr-4 lg:border-r lg:border-gray-300">
                        <div class="mb-2">
                            <a href={`/users/${request.fromUser._id}`} class="text-blue-600 hover:underline font-medium">{request.fromUser.username}</a>
                            <span class="text-gray-600"> wants to give:</span>
                        </div>
                        {#if request.offeredBooks}
                            {#each request.offeredBooks as book}
                            <div class="bg-white border border-gray-200 rounded p-3">
                                <RequestsDisplay bookId={book._id} requestCount={book.requestCount} />
                                <div class="font-semibold">{book.title}</div>
                                <div class="text-gray-600">{book.author}</div>
                            </div>
                            {/each}
                        {/if}
                    </div>
                    <!-- Takes -->
                    <div class="lg:w-1/2 w-full lg:pl-4">
                        <div class="mb-2">
                            <span class="text-gray-600">and wants to take:</span>
                        </div>
                        {#each request.requestedBooks as obj, i}
                        {#if obj.book}
                        <div>
                            <div class="bg-white border border-gray-200 rounded p-3">
                                {#if obj.book.incomingRequests > 0}
                                    <a href={`/books/${obj.book._id}/requests`} class="float-right"><span class="text-blue-500 hover:text-blue-800 font-semibold">Requests</span> <span class="bg-black text-white px-2 rounded-full">{obj.book.incomingRequests}</span></a>
                                {/if}
                                {#if obj.book.requestsCount && request.offeredBook}
                                <a href={`/books/${request.offeredBook.id}/requests`} class="float-right text-blue-600 hover:underline text-sm font-medium">
                                    Requests
                                    <span class="ml-1 bg-gray-700 text-white text-xs px-2 rounded-full">{obj.book.requestsCount}</span>
                                </a>
                                {/if}
                                <RequestsDisplay bookId={obj.book._id} requestCount={obj.book.requestCount} />
                                <div class="font-semibold">{obj.book.title} <span class="text-gray-400 text-sm">from</span> <a href={`/users/${obj.owner.id}`} class="text-blue-500 text-sm">{obj.owner.username}</a></div>
                                <div class="text-gray-600">{obj.book.author}</div>
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