<script lang="ts">
    let { data } = $props();
    const { trades } = data || [];
</script>

<div class="max-w-4xl m-8 border-2 border-gray-300 mx-auto">
    <div class="text-center w-full py-4 bg-gray-200">
        <h1 class="text-4xl">All Trades</h1>
    </div>
    <div>
        {#each trades as trade}
            {#if 'fromUser' in trade && 'toUser' in trade}
                <div class="bg-gray-100 border border-gray-300 rounded p-4 mb-4">
                    <div class="flex flex-row">
                        <!-- Gives -->
                        <div class="w-1/2 pr-4 border-r border-gray-300">
                            <div class="mb-2">
                                <a href={`/users/${trade.fromUser._id}`} class="text-blue-600 hover:underline font-medium">{trade.fromUser.username}</a>
                                <span class="text-gray-600"> gets:</span>
                            </div>
                            <div class="bg-white border border-gray-200 rounded p-3">
                                {#if trade.bookTaken}
                                    <div class="font-semibold">{trade.bookTaken.title}</div>
                                    <div class="text-gray-600">{trade.bookTaken.author}</div>
                                {:else}
                                    <div class="text-red-600">No offered book</div>
                                {/if}
                            </div>
                        </div>
                        <!-- Takes -->
                        <div class="w-1/2 pl-4">
                            <div class="mb-2">
                                <a href={`/users/${trade.toUser._id}`} class="text-blue-600 hover:underline font-medium">{trade.toUser.username}</a>
                                <span class="text-gray-600"> gets:</span>
                            </div>
                            <div>
                                <div class="bg-white border border-gray-200 rounded p-3">
                                    {#if trade.bookGiven}
                                        <div class="font-semibold">{trade.bookGiven.title}</div>
                                        <div class="text-gray-600">{trade.bookGiven.author}</div>
                                    {:else}
                                        <div class="text-red-600">No requested book</div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>