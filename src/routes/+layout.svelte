<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';

	let { children, data } = $props();
</script>

<Navbar requestsCount={data.requestsCount} />

{@render children()}
