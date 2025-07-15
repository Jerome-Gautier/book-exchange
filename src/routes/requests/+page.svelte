<script lang="ts">
	let { data } = $props();
    const requests = data.requests || [];
</script>

<div class="max-w-4xl m-8 border-2 border-gray-300 mx-auto">
    <div class="text-center w-full py-4 bg-gray-200">
        <h1 class="text-4xl">All Requests</h1>
    </div>
    <div>
        {#each requests as request}
            <div class="bg-gray-100 border border-gray-300 rounded p-4 mb-4">
                <div class="flex flex-row">
                    <!-- Gives -->
                    <div class="w-1/2 pr-4 border-r border-gray-300">
                        <div class="mb-2">
                            <a href={`/users/${request.fromUser.id}`} class="text-blue-600 hover:underline font-medium">{request.fromUser.username}</a>
                            <span class="text-gray-600"> wants to give:</span>
                        </div>
                        {#if request.offeredBook}
                        <div class="bg-white border border-gray-200 rounded p-3">
                            <div class="font-semibold">{request.offeredBook.title}</div>
                            <div class="text-gray-600">{request.offeredBook.author}</div>
                        </div>
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
                                {#if book.requestsCount && request.offeredBook}
                                <a href={`/books/${request.offeredBook.id}/requests`} class="float-right text-blue-600 hover:underline text-sm font-medium">
                                    Requests
                                    <span class="ml-1 bg-gray-700 text-white text-xs px-2 rounded-full">{book.requestsCount}</span>
                                </a>
                                {/if}
                                <div class="font-semibold">{book.title}</div>
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