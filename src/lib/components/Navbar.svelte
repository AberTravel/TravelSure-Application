<!-- Client-Side -->
<script lang="ts">
	// Travelsure Logo
	import TravelSureLogo from '$lib/components/TravelSureLogo.svelte';

	// Logout functionality
	const logout = async () => {
		// Send a request to the server to logout
		const res = await fetch('/api/v1/user/actions/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await res.json();

		// If the response is successful, redirect to the login page
		if (res.ok) {
			localStorage.clear();
			document.cookie = 'sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			window.location.href = '/';
		}
		// If the response is not successful, display an error message
		else {
			// get error message
			console.log(data.message);
		}
	};

	// Mobile Nav Toggle
	let navToggled = false;

	// Theme Change
	import { browser } from '$app/env';
	import { writable, get } from 'svelte/store';

	// Checks if the browser is in use
	// If so, it will check if there is a theme stored in local storage
	// If there is, it will use that theme
	// If not, it will use the default theme of aberTravelDark
	const siteTheme = writable<string>(
		browser ? window.localStorage.getItem('theme') ?? 'aberTravelDark' : 'aberTravelDark'
	);

	// Gets the boolean toggle value (updates when changed)
	$: dark = get(siteTheme) === 'aberTravelDark';

	// Subscribes to updates to siteTheme
	siteTheme.subscribe((value) => {
		dark = value === 'aberTravelDark';
		// Only Executes the following when in the browser
		if (browser) {
			window.localStorage.setItem('theme', value);
			document.querySelector('html').setAttribute('data-theme', value);
			// Select meta with name="theme-color" and set its content to the theme color
			document
				.querySelector('meta[name="theme-color"]')
				.setAttribute('content', value === 'aberTravelDark' ? '#292929' : '#F5F5F5');
		}
	});

	// Toggles the theme
	const toggleTheme = () => {
		if (dark) siteTheme.set('aberTravelLight');
		else siteTheme.set('aberTravelDark');
	};
</script>

<nav
	id="navbar"
	class="bg-secondary text-secondary-content bottom-0 border-t-2 lg:border-t-0 lg:border-b-2 border-accent-content fixed lg:sticky lg:top-0 inset-x-0 opacity-95 lg:mb-5 lg:pb-2 shadow-lg z-50"
>
	<div class="px-3 lg:px-10 mx-auto mb-10 lg:mb-0">
		<div class="flex justify-between lg:justify-evenly">
			<!-- Left -->
			<div class="flex space-x-2">
				<!-- Logo -->
				<div>
					<!-- User Landing Page -->
					<a href="/user/" class="flex items-center py-5 px-3" sveltekit:prefetch>
						<TravelSureLogo navbar={true} />
					</a>
				</div>

				<!-- Navigation Links -->
				<div class="hidden lg:flex items-center space-x-1">
					<!-- User Home Page -->
					<a href="/user/" class="py-5 px-3" sveltekit:prefetch>Home</a>
					<!-- Checklist Page -->
					<a href="/user/checklist" class="py-5 px-3" sveltekit:prefetch>Checklist</a>
					<!-- Destination Page -->
					<a href="/user/destination" class="py-5 px-3" sveltekit:prefetch>Destination</a>
					<!-- FAQ Page -->
					<a href="/user/faqs" class="py-5 px-3" sveltekit:prefetch>FAQs</a>

					<!-- Theme Toggle Checkbox -->
					<label class="swap swap-rotate pl-5 pr-10">
						<!-- Theme Toggler -->
						<input type="checkbox" checked={dark} on:click={toggleTheme} />

						<!-- On -->
						<svg
							class="swap-on fill-current w-6 h-6"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							><path
								d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
							/></svg
						>

						<!-- Off -->
						<svg
							class="swap-off fill-current w-6 h-6"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							><path
								d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
							/></svg
						>
					</label>
				</div>
			</div>

			<!-- Right -->
			<div class="hidden lg:flex items-center space-x-1">
				<!-- Logout Button -->
				<button on:click={() => logout()} class="btn btn-primary border border-accent"
					>Logout</button
				>
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
			<!-- User Home Page -->
			<a
				on:click={() => (navToggled = false)}
				href="/user/"
				class="block py-3 px-4 text-normal duration-300 text-center"
				sveltekit:prefetch>Home</a
			>
			<!-- Checklist Page -->
			<a
				on:click={() => (navToggled = false)}
				href="/user/checklist"
				class="block py-3 px-4 text-normal duration-300 text-center"
				sveltekit:prefetch>Checklist</a
			>
			<!-- Destination Page -->
			<a
				on:click={() => (navToggled = false)}
				href="/user/destination"
				class="block py-3 px-4 text-normal duration-300 text-center"
				sveltekit:prefetch>Destination</a
			>
			<!-- FAQ Page -->
			<a
				on:click={() => (navToggled = false)}
				href="/user/faqs"
				class="block py-3 px-4 text-normal duration-300 text-center"
				sveltekit:prefetch>FAQs</a
			>

			<div class="border-secondary-content rounded border-b-2" />

			<div class="flex items-center justify-center">
				<!-- Switch Theme Button -->
				<button
					on:click={() => {
						navToggled = false;
						toggleTheme();
					}}
					class="block py-3 px-4 text-normal duration-300">Switch Theme</button
				>
			</div>

			<div class="border-secondary-content rounded border-b-2" />

			<div class="flex items-center justify-center">
				<!-- Logout Button -->
				<button
					on:click={() => logout()}
					class="block py-3 px-4 text-normal duration-300 text-center">Logout</button
				>
			</div>
		</div>
	</div>
</nav>
