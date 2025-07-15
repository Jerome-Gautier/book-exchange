<script lang="ts">
    let { data } = $props();
    const availableBooks = data.availableBooks || [];

    type Book = {
        title?: string;
        author?: string;
        owner: {
            id: string | number;
            username: string;
            location: string;
        };
    };

    const toggleBook = (book: Book) => {
        console.log(`Adding book: ${book.title}`);
    }
</script>
<div class="max-w-4xl m-8 border-2 border-gray-300 mx-auto">
    <div class="text-center w-full py-4 bg-gray-200">
        <h1 class="text-4xl">Books <span class="text-xl">available for trade</span></h1>
    </div>
    <div>
        {#each availableBooks as book}
        <div class="flex flex-row items-center justify-between p-4 border-b border-gray-300">
            <div class="flex flex-row items-center justify-start">
                <input onclick={() => toggleBook(book)} type="checkbox" class="form-checkbox h-5 w-5 text-blue-600" />
                <div class="p-4">
                    <h2 class="text-xl font-semibold">{book.title}</h2>
                    <p class="text-gray-700">Author: {book.author}</p>
                    <p class="text-gray-500">from <a class="text-blue-500 hover:text-blue-800" href={`/users/${book.owner.id}`}>{book.owner.username}</a> in {book.owner.location}</p>
                </div>
            </div>
            <div class="text-right">
                {#if book.trades && book.trades.length >= 1}
                <a href={`/books/${book.id}/requests`}><span class="text-blue-500 hover:text-blue-800 font-semibold">Requests</span> <span class="bg-black text-white px-2 rounded-full">{book.trades.length}</span></a>
                <p>
                    ({#each book.trades as trade, index}
                        <a class="text-blue-500 hover:text-blue-800" href={`/users/${trade.fromUserId}`}>{trade.fromUsername}</a>
                        {#if index < book.trades.length - 1}
                        <span class="mr-2">,</span>{/if}
                    {/each})
                </p>
                {/if}
            </div>
        </div>
        {/each}
    </div>
</div>