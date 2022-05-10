<!-- SSR/Client-side -->
<script context="module" lang="ts">
	// @ts-ignore
	export const load = ({ session }) => {
		// Check if user is logged in
		if (session.authenticated) {
			// Redirect to user page
			return {
				status: 302,
				redirect: '/user'
			};
		}
		// Return nothing
		return {};
	};
</script>

<!-- Client-side -->
<script lang="ts">
	// Import needed modules
	import TravelSureLogo from '$lib/components/TravelSureLogo.svelte';
	import InputModal from '$lib/components/InputModal.svelte';
	import MessageModal from '$lib/components/MessageModal.svelte';
	import { onMount } from 'svelte';
	import { prefetch } from '$app/navigation';
	import { REQUESTED_IP_CODE } from '../lib/responses';

	// Modal Variables
	let modalTitle = '';
	let modalMessage = '';
	let messageModalActive = false;
	let inputModalActive = false;

	// Modal Input Variables
	let ipCode = '';

	// Login Variables
	let email = '';
	let accessCode = '';
	let awaitingLogin = false;
	let awaitingVerify = false;

	// When the component is mounted
	// Set the email and access code to the values passed in the URL
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		email = urlParams.get('email') ?? '';
		accessCode = urlParams.get('accessCode') ?? '';
	});

	const login = async () => {
		// Enable Loader
		awaitingLogin = true;

		try {
			// Send Login Request (/api/v1/user/actions/login)
			const response = await fetch('/api/v1/user/actions/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, accessCode })
			});
			// Retrieve JSON Response
			const json = await response.json();

			// Check if Login was Successful
			if (response.ok) {
				prefetch('/user');
				window.location.href = '/user';
			} else {
				switch (json.message) {
					case REQUESTED_IP_CODE.body.message:
						modalTitle = 'Verify Login Location';
						inputModalActive = true;
						break;
					default:
						modalTitle = 'An error has occured';
						modalMessage = json.message;
						messageModalActive = true;
						break;
				}
			}
		} catch (error) {
			console.log(error);
			modalTitle = 'An error has occured';
			modalMessage = 'We are unable to route your request to our database, please try again later.';
			messageModalActive = true;
		}

		// Disable Loader
		awaitingLogin = false;
	};

	let verify = async () => {
		// Enable Loader
		awaitingVerify = true;

		try {
			// Send Verify Request
			const response = await fetch('/api/v1/user/actions/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email, accessCode: accessCode, ipCode: ipCode })
			});
			// Retrieve JSON Response
			const json = await response.json();

			// Check if Verify was Successful
			if (response.ok) {
				prefetch('/user');
				window.location.href = '/user';
			} else {
				modalTitle = 'An error has occured';
				modalMessage = json.message;
				messageModalActive = true;
			}
		} catch (error) {
			console.log(error);
			modalTitle = 'An error has occured';
			modalMessage = 'We are unable to route your request to our database, please try again later.';
			messageModalActive = true;
		}

		// Disable Loader
		awaitingVerify = false;
	};
</script>

<!-- Container -->
<div
	class="container mx-auto flex flex-col items-center justify-center text-primary-content min-h-screen"
>
	<!-- Box -->
	<div
		class="bg-secondary p-8 md:px-16 md:py-10 rounded-3xl shadow-xl w-15/16 md:w-1/2 lg:w-13/32 border border-accent"
	>
		<!-- TravelSure Logo -->
		<TravelSureLogo />

		<!-- Login Form -->
		<form class="space-y-10" on:submit|preventDefault={login}>
			<!-- Email Input -->
			<div>
				<!-- Email Label -->
				<label for="email" class="block mb-5 font-bold md:text-lg">Booking Email</label>

				<!-- Email Input -->
				<input
					bind:value={email}
					placeholder="johnsmith@example.com"
					id="email"
					type="email"
					maxlength="255"
					required
					class="w-full p-5 block rounded-xl bg-primary opacity-80 shadow-inner-2xl"
				/>
			</div>

			<!-- Access Code Input -->
			<div>
				<!-- Access Code Label -->
				<label for="accessCode" class="block mb-5 font-bold md:text-lg">Booking Code</label>

				<!-- Access Code Input -->
				<input
					bind:value={accessCode}
					placeholder="cf74b8e7-e6a3-4111-a3c5-0501f5bc7d83"
					minlength="36"
					maxlength="36"
					id="accessCode"
					type="text"
					class="w-full p-5 block rounded-xl bg-primary opacity-80 shadow-inner-2xl"
					required
				/>
			</div>

			<!-- Privacy/Cookie Policies -->
			<div class="text-center space-y-8 pb-5">
				<!-- Privacy Policy -->
				<div class="flex items-center justify-center space-x-10">
					<!-- Privacy Label -->
					<label for="privacy" class="text-xs 2xs:text-base"
						>I agree to the <a href="/guest/privacy"
							><strong class="hover:brightness-150 active:brightness-50"
								>TravelSure Privacy Policy</strong
							></a
						></label
					>

					<!-- Privacy Checkbox -->
					<input id="privacy" class="checkbox checkbox-primary" type="checkbox" required />
				</div>

				<!-- Cookie Policy -->
				<div class="flex items-center justify-center space-x-10">
					<!-- Cookie Label -->
					<label for="cookies" class="text-xs 2xs:text-base"
						>I agree to the <a href="/guest/cookie"
							><strong class="hover:brightness-150 active:brightness-50"
								>TravelSure Cookie Policy</strong
							></a
						></label
					>

					<!-- Cookie Checkbox -->
					<input id="cookies" class="checkbox checkbox-primary" type="checkbox" required />
				</div>
			</div>

			<div class="flex justify-center items-center">
				<!-- Login Button -->
				<button class:loading={awaitingLogin} class="btn btn-primary btn-lg border border-accent"
					>Login</button
				>
			</div>
		</form>
	</div>
</div>

<!-- Load Input Modal -->
<InputModal bind:modalTitle bind:inputModalActive bind:onSubmit={verify}>
	<div>
		<!-- IP Code Input -->
		<input
			bind:value={ipCode}
			placeholder="012345"
			minlength="6"
			maxlength="6"
			id="ipCode"
			type="text"
			class="w-full p-5 block rounded-xl bg-primary opacity-80 shadow-inner-2xl"
			required
		/>
	</div>

	<div class="flex justify-center">
		<!-- Submit Button -->
		<button class:loading={awaitingVerify} class="btn btn-primary btn-lg border border-accent"
			>Verify</button
		>
	</div>
</InputModal>
<MessageModal bind:modalTitle bind:modalMessage bind:messageModalActive />
