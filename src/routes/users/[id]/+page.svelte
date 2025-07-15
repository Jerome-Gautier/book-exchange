<script>
    let { data } = $props();
    const user = data.user;
</script>

{#if user}
<div class="flex flex-row justify-between align-center max-w-4xl mx-auto mt-12 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
    <div class="flex flex-col">
        <h1 class="text-2xl font-bold text-gray-800 mb-8">{user.username}'s <spans class="text-lg font-light">profile</spans></h1>
        <p class="text-lg text-gray-500 mb-8"><span class="font-bold">Full Name:</span> {user.fullname}</p>
        <p class="text-lg text-gray-500 mb-8"><span class="font-bold">Location:</span> {user.location}</p>
    </div>
    <div class="flex flex-col justify-center">
        <a class="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded shadow transition font-semibold text-center" href={`/users/${user.id}/books`}>{user.username}'s Books</a>
    </div>
</div>
{:else}
<div class="max-w-md mx-auto mt-12 bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center">
    <h1 class="text-xl font-semibold text-red-600">User not found</h1>
</div>
{/if}