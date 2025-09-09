<script lang="ts">
    let { data } = $props();

    const user = data.user;

    const toggleBook = (book: any) => {
        console.log(`Toggling book: ${book.title}`);
        // Implement the logic to handle book selection
    }
</script>

{#if user}
<div class="max-w-4xl m-8 border-2 border-gray-300 mx-auto">
    <div class="text-center w-full py-4 bg-gray-200">
        <h1 class="text-4xl">{user.username}'s Books <span class="text-xl">available for trade</span></h1>
    </div>
    <div>
        {#each user.books as book}
        <div class="flex flex-row items-center justify-between p-4 border-b border-gray-300">
            <div class="flex flex-row items-center justify-start">
                <input onclick={() => toggleBook(book)} type="checkbox" class="form-checkbox h-5 w-5 text-blue-600" />
                <div class="p-4">
                    <h2 class="text-xl font-semibold">{book.title}</h2>
                    <p class="text-gray-700">Author: {book.author}</p>
                    <p class="text-gray-500">from <a class="text-blue-500 hover:text-blue-800" href={`/users/${user.id}`}>{user.username}</a> in {user.location}</p>
                </div>
            </div>
            <div class="text-right">
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
            </div>
        </div>
        {/each}
    </div>
</div>
{/if}