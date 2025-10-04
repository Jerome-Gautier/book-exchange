<script>
	import { goto } from "$app/navigation";

    export let selection;

    const handleNewRequest = async() => {
        if (selection.length === 0) {
            alert('Please select at least one book to request.');
            return;
        }

        const response = await fetch('/api/set-requests-cookies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name: 'requestedBooks',
                selection
            })
        });

        if (response.status === 200) {
            goto(`/requests/new`);
        }
    }
</script>

<button
    class:active={selection.length > 0}
    class="request-btn fixed right-1/4 bottom-8 -translate-x-1/2 bg-gray-500 hover:bg-gray-700 text-white px-6 py-3 rounded shadow-lg transition cursor-pointer z-50"
    onclick={handleNewRequest}
>
    Continue
</button>

<style>
    .request-btn.active {
        background-color: #2563eb;
    }

    .request-btn.active:hover {
        background-color: #1e40af;
    }
</style>