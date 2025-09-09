<script lang="ts">
    let { data } = $props();
    const book: any = data.book;
    const { requests } = data;
    console.log(requests);
</script>

{#if book}
<div class="max-w-4xl m-8 border-2 border-gray-300 mx-auto">
    <div class="text-center w-full py-4 bg-gray-200">
        <h1 class="text-4xl">All Requests for {book.title}</h1>
    </div>
    <div>
        {#if requests && requests.length === 0}
            <div class="text-center p-4 text-gray-600">No requests found for this book.</div>
        {:else}
        {#each requests as request}
            <div class="bg-gray-100 border border-gray-300 rounded p-4 mb-4">
                <div class="flex flex-col sm:flex-row sm:gap-0 gap-4">
                    <!-- Gives -->
                    <div class="sm:w-1/2 sm:pr-4 sm:border-r border-gray-300">
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
                    <div class="sm:w-1/2 sm:pl-4">
                        <div class="mb-2">
                            <span class="text-gray-600">and wants to take:</span>
                        </div>
                        {#if request.requestedBooks}
                            {#each request.requestedBooks as book}
                            <div>
                                <div class="bg-white border border-gray-200 rounded p-3">
                                    <div class="font-semibold">{book.title} <span class="font-light">from</span><a href={`/users/${book.ownerId}`} class="text-blue-500 ml-1">{book.ownerUsername}</a></div>
                                    <div class="text-gray-600">{book.author}</div>
                                </div>
                            </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
        {/if}
    </div>
</div>
{/if}