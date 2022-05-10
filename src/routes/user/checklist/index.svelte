<!-- SSR/Client -->
<script context="module" lang="ts">
	// @ts-ignore
	export const load = async ({ fetch }) => {
		// Send a request to the server
		let requirementsData = await (
			await fetch(`/api/v1/user/requirements`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json();

		return {
			props: {
				requirements: requirementsData.requirements,
				isThereUserChecklist: requirementsData.isThereUserChecklist
			}
		};
	};
</script>

<!-- Client-side -->
<script lang="ts">
	import { prefetch } from '$app/navigation';

	// Import needed modules
	import InputModal from '$lib/components/InputModal.svelte';
	import MessageModal from '$lib/components/MessageModal.svelte';

	// Modal Variables
	let modalTitle = '';
	let modalMessage = '';
	let messageModalActive = false;
	let inputModalActive = false;

	// Modal Input Variables
	let checklistName = '';
	let awaitingCreate = false;

	$: toggles = {};

	export let requirements: {
		[key: string]: {
			[key: string]: {
				name: string;
				value: boolean;
			};
		};
	} = {};
	export let isThereUserChecklist: boolean = false;

	let createNewChecklistModal = () => {
		// Set the modal title
		modalTitle = 'Create New Checklist';

		// Set the modal message
		modalMessage = `Enter a name for your new checklist.`;

		// Set the input modal active
		inputModalActive = true;
	};

	let createNewChecklist = async () => {
		if (checklistName.length > 1) {
			// Enable Loader
			awaitingCreate = true;

			try {
				// Send a request to the server
				const response = await fetch(`/api/v1/user/checklist`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						name: checklistName
					})
				});
				// Retrieve JSON Response
				const json = await response.json();

				// Check if the response is successful
				if (response.ok) isThereUserChecklist = true;
				else {
					// Set modal message
					modalTitle = 'Error';
					modalMessage = json.message;
					// Show modal
					messageModalActive = true;
				}
			} catch (error) {
				console.log(error);
				modalTitle = 'An error has occured';
				modalMessage =
					'We are unable to route your request to our database, please try again later.';
				messageModalActive = true;
			}
		} else {
			modalTitle = 'Error';
			modalMessage = 'Checklist name cannot be empty';
			messageModalActive = true;
		}

		// Disable Loader
		awaitingCreate = false;

		// Close Input modal
		inputModalActive = false;
	};

	const hoverNextPrefetch = () => prefetch('/user/checklist/1');
	const loadNextChecklist = () => (window.location.href = '/user/checklist/1');

	const updateEssentialChecklist = async (destination: string, id: string, toggleID: string) => {
		let value = requirements[destination][id].value;

		try {
			// Send a request to the server
			const response = await fetch(`/api/v1/user/requirements`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					destination,
					requirement: id,
					value: !value
				})
			});
			// Retrieve JSON Response
			const json = await response.json();

			// Check if Update was Successful
			if (response.ok) requirements[destination][id].value = !value;
			else {
				// Modal Message
				modalTitle = 'An error has occured';
				modalMessage = json.message;
				// Show Modal
				messageModalActive = true;
				// Reset Toggle
				toggles[toggleID] = value;
			}
		} catch (error) {
			console.error(error);
			modalTitle = 'An error has occured';
			modalMessage = 'We are unable to route your request to our database, please try again later.';
			messageModalActive = true;
			// Reset Toggle
			toggles[toggleID] = value;
		}
	};
</script>

<div class="pb-20 lg:container lg:mx-auto">
	<div class="flex justify-center space-x-10 p-10">
		<h1 class="text-primary-content text-5xl md:text-6xl font-bold text-center">Checklist</h1>
	</div>

	<div class="flex justify-center space-x-24 pb-10">
		<button
			class="btn btn-secondary border border-accent opacity-0"
			disabled="true"
			aria-label="Last Checklist"
			aria-hidden="true"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<h2 class="text-primary-content text-lg md:text-3xl font-bold text-center">
			Destination Requirements
		</h2>

		<button
			class="btn btn-secondary border border-accent"
			class:opacity-0={!isThereUserChecklist}
			disabled={!isThereUserChecklist}
			aria-label="Next Checklist"
			aria-hidden={!isThereUserChecklist}
			on:click={loadNextChecklist}
			on:mouseenter={hoverNextPrefetch}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>

	<div class="flex justify-center pb-16 space-x-10">
		<button
			class="btn btn-secondary md:btn-wide text-lg border border-accent-content"
			on:click={createNewChecklistModal}
		>
			New Checklist
		</button>
	</div>

	<div class="lg:container lg:mx-auto">
		<div
			class="px-14 min-w-full bg-secondary text-secondary-content py-5 pb-10 border-y-2 xl:border-x-2 border-accent"
		>
			{#each Object.entries(requirements) as destination}
				<h1 class="text-2xl md:text-4xl py-10 text-center">
					{destination[0]}
				</h1>
				<div class="flex flex-col">
					{#each Object.entries(destination[1]) as task}
						{#if toggles[`${destination}-${task[1].name}`] === undefined}
							<span class="hidden"
								>{(toggles[`${destination}-${task[1].name}`] = task[1].value)}</span
							>
						{/if}
						<div class="flex justify-between border-b border-accent mb-5 pb-5">
							<div class="flex justify-center space-x-4">
								<h2
									class="text-lg md:text-3xl text-secondary-content line-through-primary"
									class:line-through={task[1].value}
								>
									{task[1].name}
								</h2>
							</div>
							<input
								aria-label="Toggle {destination}-{task[1].name}"
								type="checkbox"
								checked={toggles[`${destination}-${task[1].name}`]}
								class="checkbox checkbox-lg checkbox-primary"
								on:click={() =>
									updateEssentialChecklist(
										destination[0],
										task[0],
										`${destination}-${task[1].name}`
									)}
							/>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Load Input Modal -->
<InputModal bind:modalTitle bind:inputModalActive bind:onSubmit={createNewChecklist}>
	<div>
		<!-- Checklist Name Input -->
		<input
			bind:value={checklistName}
			placeholder="John's Holiday Checklist"
			minlength="1"
			maxlength="255"
			id="checklistName"
			type="text"
			class="w-full p-5 block rounded-xl bg-primary opacity-80 shadow-inner-2xl"
			required
		/>
	</div>

	<div class="flex justify-center">
		<!-- Submit Button -->
		<button class:loading={awaitingCreate} class="btn btn-primary btn-lg border border-accent"
			>Create</button
		>
	</div>
</InputModal>
<MessageModal bind:modalTitle bind:modalMessage bind:messageModalActive />
