<script lang="ts">
    const { data } = $props();

    const user = { ...data.user };

    let { username, fullname, email, location } = $state(user);

    const handleSubmit = async() => {
        const updatedUser = {
            id: user.id,
            username,
            fullname,
            email,
            location
        }

        const response = await fetch(`/api/users`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });

        const data = await response.json();
        if (response.ok) {
            window.alert("User updated successfully");
        } else {
            window.alert(data.error);
        }
    }
</script>

<div class="flex flex-col items-center min-h-screen bg-gray-50 py-8">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold mb-6 text-center">Edit User</h1>
        <form id="edit-user-form" class="space-y-5">
            <input type="hidden" id="user-id" />
            <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" id="username" bind:value={username} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition" />
            </div>
            <div>
                <label for="fullname" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" id="fullname" bind:value={fullname} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition" />
            </div>
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" bind:value={email} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition" />
            </div>
            <div>
                <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" id="location" bind:value={location} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition" />
            </div>
            <button type="submit" onclick={handleSubmit} class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition">Save Changes</button>
        </form>
    </div>
</div>