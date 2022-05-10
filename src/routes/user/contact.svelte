<!-- Client-Side -->
<script lang="ts">
	// Import needed modules
	import MessageModal from '$lib/components/MessageModal.svelte';

	// Modal Variables
	let modalTitle = '';
	let modalMessage = '';
	let messageModalActive = false;

	// Component Variables
	export let name = '';
	export let email = '';
	export let message = '';
	export let awaitingEmail = false;

	const sendEmail = async () => {
		// Enable Loader
		awaitingEmail = true;

		try {
			// Send Contact Request (/api/v1/user/actions/contact)
			const response = await fetch('/api/v1/user/actions/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, message })
			});
			// Retrieve JSON Response
			const json = await response.json();

			// Check if Contact was Successful
			if (response.ok) {
				// Reset Form
				name = '';
				email = '';
				message = '';
				// Show Success Modal
				modalTitle = 'Message Sent';
				modalMessage = 'Your message has been sent, we will get back to you as soon as possible.';
				messageModalActive = true;
			} else {
				// Show Error Modal
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
		awaitingEmail = false;
	};
</script>

<div class="pb-20 lg:container lg:mx-auto">
	<div class="flex justify-center space-x-10 p-10">
		<h1 class="text-primary-content text-5xl md:text-6xl font-bold text-center">Contact Us</h1>
	</div>

	<!-- Container -->
	<div
		class="container mx-auto flex flex-col items-center justify-center text-primary-content pt-16"
	>
		<!-- Box -->
		<div
			class="bg-secondary p-8 md:px-16 md:py-10 rounded-3xl shadow-xl w-15/16 md:w-1/2 lg:w-13/32 border border-accent"
		>
			<!-- Contact Form -->
			<form class="space-y-10" on:submit|preventDefault={sendEmail}>
				<!-- Name Input -->
				<div>
					<!-- Name Label -->
					<label for="name" class="block mb-5 font-bold md:text-lg">Full Name</label>

					<!-- Name Input -->
					<input
						bind:value={name}
						placeholder="John Smith"
						id="name"
						type="text"
						maxlength="255"
						required
						class="w-full p-5 block rounded-xl bg-primary opacity-80 shadow-inner-2xl"
					/>
				</div>

				<!-- Email Input -->
				<div>
					<!-- Email Label -->
					<label for="email" class="block mb-5 font-bold md:text-lg">Email</label>

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

				<!-- Message Input -->
				<div>
					<!-- Message Label -->
					<label for="message" class="block mb-5 font-bold md:text-lg">Message</label>

					<!-- Message Input -->
					<textarea
						bind:value={message}
						placeholder="Hello, I would like to..."
						id="message"
						class="w-full p-5 block rounded-xl bg-primary opacity-80 shadow-inner-2xl"
					/>
				</div>

				<div class="flex justify-center items-center">
					<!-- Login Button -->
					<button class:loading={awaitingEmail} class="btn btn-primary btn-lg border border-accent"
						>Send</button
					>
				</div>
			</form>
		</div>
	</div>
</div>

<MessageModal bind:modalTitle bind:modalMessage bind:messageModalActive />
