<script lang="ts">
    import { page } from '$app/state';
	import { signOut } from '@auth/sveltekit/client';

    export let requestsCount: number = 0;
    
    let session = page.data.session;

    let showRequestsDropdown = false;
    let showUserDropdown = false;
</script>

<nav class="bg-gray-800 text-white px-6 py-3 shadow">
    <div class="max-w-6xl mx-auto flex flex-col gap-4">
        <div class="flex flex-row justify-between">
            <a class="text-xl font-bold tracking-wide hover:text-blue-300 transition" href="/books">
                Book Exchange
            </a>
        <div>
        {#if !session}
            <a class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition font-medium" href="/users/login">
                Login
            </a>
        {:else if session.user}
            <div class="relative group inline-block">
                <button
                    class="font-semibold px-4 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
                    onmouseenter={() => showUserDropdown = true}
                    onmouseleave={() => showUserDropdown = false}
                >
                    {session.user.name}
                </button>
                <ul
                    class="absolute right-0 w-48 bg-white text-gray-800 rounded shadow-lg border border-gray-200 z-10"
                    onmouseenter={() => showUserDropdown = true}
                    onmouseleave={() => showUserDropdown = false}
                    class:hidden={!showUserDropdown}
                >
                    <li>
                        <a class="block px-4 py-2 hover:bg-gray-100" href={`/users/${session.user.id}`}>
                            Profile
                        </a>
                    </li>
                    <li>
                        <a class="block px-4 py-2 hover:bg-gray-100" href={`/users/edit`}>
                            Edit Profile
                        </a>
                    </li>
                    <li>
                        <a class="block px-4 py-2 hover:bg-gray-100" href={`/books/my`}>
                            My Books
                        </a>
                    </li>
                    <li>
                        <button class="cursor-pointer block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600" onclick={() => signOut()}>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
            {/if}
        </div>
    </div>
    <ul class="flex gap-6">
            <li>
                <a class="hover:text-blue-400 transition" href="/books">Books</a>
            </li>
            <li>
                {#if !session}
                    <a class="hover:text-blue-400 transition" href="/requests">Requests</a>
                {:else if session.user}
                    <div class="relative group inline-block">
                        <a href="/requests">
                            <button
                                class="hover:text-blue-400 transition cursor-pointer"
                                onmouseenter={() => showRequestsDropdown = true}
                                onmouseleave={() => showRequestsDropdown = false}
                            >
                                Requests
                                {#if requestsCount > 0}
                                    <span class="ml-1 bg-red-500 text-white text-xs px-2 rounded-full">{requestsCount}</span>
                                {/if}
                            </button>
                        </a>
                        <ul
                            class="absolute left-0 w-56 bg-white text-gray-800 rounded shadow-lg border border-gray-200 z-10"
                            onmouseenter={() => showRequestsDropdown = true}
                            onmouseleave={() => showRequestsDropdown = false}
                            class:hidden={!showRequestsDropdown}
                        >
                            <li>
                                <a class="block px-4 py-2 hover:bg-gray-100" href={`/requests`}>
                                    All Requests
                                </a>
                            </li>
                            {#if requestsCount > 0}
                            <li>
                                <a class="block px-4 py-2 hover:bg-gray-100" href={`/requests/incoming`}>
                                    Incoming Requests
                                    <span class="ml-1 bg-red-500 text-white text-xs px-2 rounded-full">{requestsCount}</span>
                                </a>
                            </li>
                            {/if}
                            <li>
                                <a class="block px-4 py-2 hover:bg-gray-100" href={`/requests/new`}>
                                    Create Request
                                </a>
                            </li>
                        </ul>
                    </div>
                {/if}
            </li>
            <li>
                <a class="hover:text-blue-400 transition" href="/trades">Trades</a>
            </li>
            <li>
                <a class="hover:text-blue-400 transition" href="/users">Users</a>
            </li>
        </ul>
    </div>
</nav>