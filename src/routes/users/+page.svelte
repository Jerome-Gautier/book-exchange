<script lang="ts">
    let { data } = $props();
    const users = data.users || [];
</script>

<div class="max-w-3xl mx-auto mt-10">
    <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Users</h1>
    <div class="space-y-6">
        {#each users as user}
            <div class="bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-col">
                <div class="mb-4">
                    <a href={`/users/${user.id}`} class="text-xl font-semibold text-blue-600 hover:underline">{user.username}</a>
                    <p class="text-gray-500">Location: {user.location}</p>
                </div>
                <div class="flex flex-row gap-2 mt-4 md:mt-0">
                    <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium">Books: {user.booksCount}</span>
                    {#if user.requestsCount > 0}
                        <span class="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm font-medium">
                            Incoming requests: {user.requestsCount}
                        </span>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>