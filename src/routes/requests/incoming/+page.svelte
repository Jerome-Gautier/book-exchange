<script lang="ts">
    const { data } = $props();
    const userId = data.userId;

    let requests = $state(data.incomingRequests || []);

    const handleAccept = async (requestId: number, offeredBook: any, requestedBook: any, index: number) => {
        const requestObject = {
            userId,
            requestId,
            offeredBook,
            requestedBook
        }

        const response = await fetch(`/api/trades/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestObject),
        });

        if (response.ok) {
            alert('Trade accepted successfully!');
        } else {
            alert('Failed to accept request. Please try again.');
        }
    }
</script>

<div class="max-w-4xl m-8 border-2 border-gray-300 mx-auto">
    <div class="text-center w-full py-4 bg-gray-200">
        <h1 class="text-4xl">Incoming Requests</h1>
    </div>
    {#if requests.length > 0}
        <div>
            {#each requests as request, index}
                <div class="relative bg-gray-100 border border-gray-300 rounded p-4 m-4">
                    <div class="flex flex-row">
                        <!-- Gives -->
                        <div class="w-1/2 pr-4 border-r border-gray-300">
                            <div class="mb-2">
                                <button onclick={() => handleAccept(request.id, request.offeredBook, request.requestedBook, index )} class="absolute top-2 right-2 cursor-pointer bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow transition font-semibold text-sm">Accept Trade</button>
                                <a href={`/users/${request.fromUser.id}`} class="text-blue-600 hover:underline font-medium">{request.fromUser.username}</a>
                                <span class="text-gray-600"> wants to give:</span>
                            </div>
                            <div class="bg-white border border-gray-200 rounded p-3">
                                <div class="font-semibold">{request.offeredBook.title}</div>
                                <div class="text-gray-600">{request.offeredBook.author}</div>
                                <div class="text-gray-600">Condition: {request.offeredBook.condition}</div>
                            </div>
                        </div>
                        <!-- Takes -->
                        <div class="w-1/2 pl-4">
                            <div class="mb-2">
                                <span class="text-gray-600">and wants to take:</span>
                            </div>
                            <div>
                                <div class="bg-white border border-gray-200 rounded p-3">
                                    <div class="font-semibold">{request.requestedBook.title}</div>
                                    <div class="text-gray-600">{request.requestedBook.author}</div>
                                    <div class="text-gray-600">Condition: {request.requestedBook.condition}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="max-w-4xl bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center">
            <h1 class="text-xl font-semibold text-gray-600">No incoming requests</h1>
        </div>
    {/if}
</div>