<!-- SSR/Client-side -->
<script context="module" lang="ts">
	// @ts-ignore
	export const load = ({ session }) => {
		// Check if user is logged in
		if (session.authenticated) {
			// Redirect to user privacy page
			return {
				status: 302,
				redirect: '/user/privacy'
			};
		}
		// Return nothing
		return {};
	};
</script>

<!-- Client-Side -->
<script lang="ts">
	import PrivacyPolicy from '$lib/components/PrivacyPolicy.svelte';
</script>

<PrivacyPolicy />
