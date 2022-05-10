<!-- Client-side -->
<script lang="ts">
	export let navbar = false;
</script>

<!-- Navbar or Full-Size Logo -->
{#if navbar}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-6 w-6 mr-1 text-primary-content"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
		/></svg
	>
	<span class="font-bold text-lg">TravelSure</span>
{:else}
	<div
		class="flex items-center justify-center py-5 px-3 mb-10 md:mb-6 text-4xl lg:text-6xl font-bold"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-10 w-10 lg:h-16 lg:w-16 mr-2 lg:mt-2 text-primary-content"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
			/></svg
		>
		<h2>TravelSure</h2>
	</div>
{/if}
