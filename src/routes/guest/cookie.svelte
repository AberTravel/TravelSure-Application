<!-- SSR/Client-side -->
<script context="module" lang="ts">
	// @ts-ignore
	export const load = ({ session }) => {
		// Check if user is logged in
		if (session.authenticated) {
			// Redirect to user cookie page
			return {
				status: 302,
				redirect: '/user/cookie'
			};
		}
		// Return nothing
		return {};
	};
</script>

<!-- Client-Side -->
<script lang="ts">
	import CookiePolicy from '$lib/components/CookiePolicy.svelte';
</script>

<CookiePolicy />
