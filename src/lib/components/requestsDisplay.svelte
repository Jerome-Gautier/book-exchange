<script lang="ts">
    export let requestCount: number;
    export let bookId: string;
    export let requesters: { id: string; username: string }[] | null = null;
</script>

<div class="text-right float-right">
    {#if requestCount >= 1}
    <a href={`/books/${bookId}/requests`}><span class="text-blue-500 hover:text-blue-800 font-semibold">Requests</span> <span class="bg-black text-white px-2 rounded-full">{requestCount}</span></a>
        {#if requesters && requesters.length > 0}
        <p>
            ({#each requesters as user, index}
                <a class="text-blue-500 hover:text-blue-800" href={`/users/${user.id}`}>{user.username}</a>
                {#if index < requesters.length - 1}
                <span class="mr-2">,</span>{/if}
            {/each})
        </p>
        {/if}
    {/if}
</div>