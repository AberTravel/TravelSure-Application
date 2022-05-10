<!-- Client-Side -->
<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import GuestNavbar from '$lib/components/GuestNavbar.svelte';
</script>

<Header />
<GuestNavbar />

<div class="flex flex-col min-h-screen justify-between">
	<div class="flex-grow">
		<slot />
	</div>
</div>
