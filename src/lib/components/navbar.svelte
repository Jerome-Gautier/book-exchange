<script lang="ts">
    import { page } from '$app/state';
	import { signOut } from '@auth/sveltekit/client';
    
    let session = page.data.session;

    let showDropdown = false;
</script>

<nav class="bg-gray-800 text-white px-6 py-3 shadow">
    <div class="max-w-6xl mx-auto flex md:items-center justify-between">
        <div class="flex flex-col md:flex-row md:items-center gap-6">
            <a class="text-xl font-bold tracking-wide hover:text-blue-300 transition" href="/books">
                Book Exchange
            </a>
            <ul class="flex gap-6">
                <li>
                    <a class="hover:text-blue-400 transition" href="/books">Books</a>
                </li>
                <li>
                    <a class="hover:text-blue-400 transition" href="/requests">Requests</a>
                </li>
                <li>
                    <a class="hover:text-blue-400 transition" href="/trades">Trades</a>
                </li>
                <li>
                    <a class="hover:text-blue-400 transition" href="/users">Users</a>
                </li>
            </ul>
        </div>
        <div>
            {#if !session}
                <a class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition font-medium" href="/users/login">
                Login
            </a>
            {:else if session.user}
                <div class="relative group inline-block">
                    <button
                        class="font-semibold px-4 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
                        onmouseenter={() => showDropdown = true}
                        onmouseleave={() => showDropdown = false}
                    >
                        {session.user.name}
                    </button>
                    <ul
                        class="absolute right-0 w-48 bg-white text-gray-800 rounded shadow-lg border border-gray-200 z-10"
                        onmouseenter={() => showDropdown = true}
                        onmouseleave={() => showDropdown = false}
                        class:hidden={!showDropdown}
                    >
                        <li>
                            <a class="block px-4 py-2 hover:bg-gray-100" href={`/users/${session.user.id}`}>
                                Profile
                            </a>
                        </li>
                        <li>
                            <a class="block px-4 py-2 hover:bg-gray-100" href={`/users/${session.user.id}`}>
                                Edit Profile
                            </a>
                        </li>
                        <li>
                            <a class="block px-4 py-2 hover:bg-gray-100" href={`/users/${session.user.id}/books`}>
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
</nav>