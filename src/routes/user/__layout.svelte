<!-- SSR/Client-side -->
<script context="module" lang="ts">
	// @ts-ignore
	export const load = ({ session }) => {
		// Check if user is not logged in
		if (!session.authenticated) {
			// Redirect to login page
			return {
				status: 302,
				redirect: '/'
			};
		}
		// Return nothing
		return {};
	};
</script>

<!-- Client-Side -->
<script>
	import Header from '$lib/components/Header.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Header />
<Navbar />

<div class="flex flex-col min-h-screen justify-between">
	<div class="flex-grow">
		<slot />
	</div>

	<Footer />
</div>
