<script>
	// Travelsure Logo
	import TravelSureLogo from '$lib/components/TravelSureLogo.svelte';

	// Whether the Mobile Navbar is toggled
	let navToggled = false;

	// Return to base URL
	const goBack = () => (window.location.href = '/');
</script>

<nav
	class="bg-secondary text-secondary-content bottom-0 border-t-2 lg:border-t-0 lg:border-b-2 border-accent-content fixed lg:sticky lg:top-0 inset-x-0 opacity-95 lg:mb-5 shadow-lg z-50"
>
	<div class="px-3 lg:px-10 mx-auto mb-10 lg:mb-0">
		<div class="flex justify-between lg:justify-evenly">
			<!-- Left -->
			<div class="flex space-x-2">
				<div class="duration-500">
					<!-- Login Landing Page -->
					<a href="/" class="flex items-center py-5 px-3" sveltekit:prefetch>
						<TravelSureLogo navbar={true} />
					</a>
				</div>

				<div class="hidden lg:flex items-center space-x-1">
					<!-- Privacy Page -->
					<a href="/guest/privacy" class="py-5 px-3" sveltekit:prefetch>Privacy Policy</a>

					<!-- Cookie Page -->
					<a href="/guest/cookie" class="py-5 px-3" sveltekit:prefetch>Cookie Policy</a>
				</div>
			</div>

			<!-- Right -->
			<div class="hidden lg:flex items-center space-x-1">
				<!-- Back Button -->
				<button on:click={() => goBack()} class="btn btn-primary"> Go Back </button>
			</div>

			<!-- Mobile Menu Button -->
			<div class="lg:hidden flex items-center">
				<!-- Menu Toggle Button -->
				<button
					on:click={() => (navToggled = !navToggled)}
					aria-label="Navigation Toggle Button"
					class="btn btn-primary rounded active:btn-secondary focus:btn-primary"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/></svg
					>
				</button>
			</div>
		</div>

		<!-- Mobile Menu -->
		<div class:hidden={!navToggled} class="hidden lg:hidden">
			<!-- Privacy Page -->
			<a
				on:click={() => (navToggled = false)}
				href="/guest/privacy"
				class="block py-3 px-4 text-normal duration-300 text-center">Privacy Policy</a
			>
			<!-- Cookie Page -->
			<a
				on:click={() => (navToggled = false)}
				href="/guest/cookie"
				class="block py-3 px-4 text-normal duration-300 text-center">Cookie Policy</a
			>

			<!-- Navbar Divider -->
			<div class="border-secondary-content rounded border-b-2" />

			<div class="flex items-center justify-center">
				<!-- Back Button -->
				<button
					on:click={() => goBack()}
					class="block py-3 px-4 text-normal duration-300 text-center">Go Back</button
				>
			</div>
		</div>
	</div>
</nav>
