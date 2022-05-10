<script lang="ts">
	// Redirect User to Base Root (when page is loaded)
	// (this will lead to either staff or user landing page)
	import { onMount } from 'svelte';
	onMount(() => {
		window.location.href = '/';
	});
</script>
