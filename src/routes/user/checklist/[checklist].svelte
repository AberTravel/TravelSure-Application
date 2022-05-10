<!-- SSR/Client -->
<script context="module" lang="ts">
	// @ts-ignore
	export const load = async ({ fetch, params }) => {
		// Parse parms.checklist, 1 if NaN
		let checklist = parseInt(params.checklist) || 1;
		// Send a request to the server
		let checklistData = await (
			await fetch(`/api/v1/user/checklist?checklist=${checklist - 1}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json();

		return {
			props: {
				checklist: checklistData.checklist,
				isThereNextChecklist: checklistData.isThereNextChecklist,
				currentChecklist: checklist
			}
		};
	};
</script>

<!-- Client-side -->
<script lang="ts">
	// Import needed modules
	import { prefetch } from '$app/navigation';
	import InputModal from '$lib/components/InputModal.svelte';
	import MessageModal from '$lib/components/MessageModal.svelte';

	// Modal Variables
	let modalTitle = '';
	let modalMessage = '';
	let messageModalActive = false;
	let createChecklistModalActive = false;
	let deleteChecklistModalActive = false;
	let createTaskModalActive = false;
	let deleteTaskModalActive = false;

	// Modal Input Variables
	let checklistName = '';
	let taskName = '';
	let awaiting = false;

	$: toggles = {};

	export let checklist: {
		name: string;
		items: { [key: string]: boolean };
	};
	export let isThereNextChecklist = false;
	export let currentChecklist = 0;

	let createNewChecklistModal = () => (createChecklistModalActive = true);

	let createNewChecklist = async () => {
		if (checklistName.length >= 1) {
			// Enable Loader
			awaiting = true;

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
				if (response.ok) isThereNextChecklist = true;
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
		awaiting = false;

		// Close Input modal
		createChecklistModalActive = false;
	};

	let deleteChecklistModal = () => (deleteChecklistModalActive = true);

	let deleteChecklist = async () => {
		// Enable Loader
		awaiting = true;

		try {
			prefetch(
				currentChecklist > 1 ? `/user/checklist/${currentChecklist - 1}` : '/user/checklist'
			);
			// Send a request to the server
			const response = await fetch(`/api/v1/user/checklist`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					checklistID: currentChecklist - 1
				})
			});
			// Retrieve JSON Response
			const json = await response.json();

			// Check if deletion was successful
			if (response.ok)
				currentChecklist > 1
					? (window.location.href = `/user/checklist/${currentChecklist - 1}`)
					: (window.location.href = '/user/checklist');
			else {
				// Set modal variables
				modalTitle = 'Error';
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
		awaiting = false;

		// Close Input modal
		deleteChecklistModalActive = false;
	};

	const updateChecklist = async (taskName: string) => {
		let value = checklist.items[taskName];

		try {
			// Send a request to the server
			const response = await fetch(`/api/v1/user/checklist`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					checklist: currentChecklist - 1,
					taskName,
					value: !value
				})
			});
			// Retrieve JSON Response
			const json = await response.json();

			// Check if Update was Successful
			if (response.ok) checklist.items[taskName] = !value;
			else {
				// Modal Message
				modalTitle = 'An error has occured';
				modalMessage = json.message;
				// Show Modal
				messageModalActive = true;
				// Reset Toggle
				toggles[taskName] = value;
			}
		} catch (error) {
			console.log(error);
			modalTitle = 'An error has occured';
			modalMessage = 'We are unable to route your request to our database, please try again later.';
			messageModalActive = true;
			// Reset Toggle
			toggles[taskName] = value;
		}
	};

	const loadPreviousChecklist = () =>
		currentChecklist > 1
			? (window.location.href = `/user/checklist/${currentChecklist - 1}`)
			: (window.location.href = '/user/checklist/');
	const hoverPreviousPrefetch = () =>
		currentChecklist > 1
			? prefetch(`/user/checklist/${currentChecklist - 1}`)
			: prefetch(`/user/checklist`);
	const hoverNextPrefetch = () =>
		isThereNextChecklist ? prefetch(`/user/checklist/${currentChecklist + 1}`) : null;
	const loadNextChecklist = () =>
		isThereNextChecklist
			? (window.location.href = `/user/checklist/${currentChecklist + 1}`)
			: null;

	let deleteTaskModal = (name: string) => {
		taskName = name;
		deleteTaskModalActive = true;
	};

	let deleteTask = async () => {
		// Enable Loader
		awaiting = true;

		try {
			// Send a request to the server
			const response = await fetch(`/api/v1/user/task`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					checklistID: currentChecklist - 1,
					taskName
				})
			});
			// Retrieve JSON Response
			const json = await response.json();

			// Check if deletion was successful
			if (response.ok) {
				// Reload Page to show updates
				prefetch(`/user/checklist/${currentChecklist}`);
				window.location.href = `/user/checklist/${currentChecklist}`;
			} else {
				// Set modal variables
				modalTitle = 'Error';
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
		awaiting = false;

		// Close Input modal
		deleteTaskModalActive = false;
	};

	let createTaskModal = () => (createTaskModalActive = true);

	let createNewTask = async () => {
		if (taskName.length >= 1) {
			try {
				// Send a request to the server
				const response = await fetch(`/api/v1/user/task`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						checklistID: currentChecklist - 1,
						taskName
					})
				});
				// Retrieve JSON Response
				const json = await response.json();

				// Check if the response is successful
				if (response.ok) checklist.items[taskName] = false;
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
			modalMessage = 'Task name cannot be empty';
			messageModalActive = true;
		}

		// Disable Loader
		awaiting = false;

		// Close Input modal
		createTaskModalActive = false;
	};
</script>

<div class="pb-20 lg:container lg:mx-auto">
	<div class="flex justify-center space-x-10 p-10">
		<h1 class="text-primary-content text-5xl md:text-6xl font-bold text-center">Checklist</h1>
	</div>

	<div class="flex justify-center space-x-24 pb-10">
		<button
			class="btn btn-secondary border border-accent"
			on:click={loadPreviousChecklist}
			on:mouseenter={hoverPreviousPrefetch}
			aria-label="Previous Checklist"
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
			{checklist.name ?? 'Unable to Find Name'}
		</h2>

		<button
			class="btn btn-secondary border border-accent"
			class:opacity-0={!isThereNextChecklist}
			disabled={!isThereNextChecklist}
			aria-label="Next Checklist"
			aria-hidden={!isThereNextChecklist}
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
		<button
			class="btn btn-secondary md:btn-wide text-lg border border-accent-content"
			on:click={deleteChecklistModal}
		>
			Delete Checklist
		</button>
	</div>

	<div class="lg:container lg:mx-auto">
		<div
			class="px-14 min-w-full bg-secondary text-secondary-content py-5 pb-10 border-y-2 xl:border-x-2 border-accent"
		>
			<h1 class="text-2xl md:text-4xl py-10 text-center">Tasks</h1>
			<div class="flex flex-col">
				{#each Object.entries(checklist.items) as task}
					{#if toggles[task[0]] === undefined}
						<span class="hidden">{(toggles[task[0]] = task[1])}</span>
					{/if}
					<div class="flex justify-between border-b border-accent mb-5 pb-5">
						<div class="flex justify-center space-x-4">
							<div>
								<svg
									on:click={() => deleteTaskModal(task[0])}
									xmlns="http://www.w3.org/2000/svg"
									class="h-7 w-7 md:h-10 md:w-10 text-accent-content"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</div>
							<h2
								class="text-lg md:text-3xl text-secondary-content line-through-primary"
								class:line-through={task[1]}
							>
								{task[0]}
							</h2>
						</div>
						<input
							aria-label="Toggle {task[0]}"
							type="checkbox"
							bind:checked={toggles[task[0]]}
							class="checkbox checkbox-lg checkbox-primary"
							on:click={() => updateChecklist(task[0])}
						/>
					</div>
				{/each}
			</div>
			<div class="flex justify-center pt-10">
				<button
					class="btn btn-primary btn-wide text-lg border border-accent-content"
					on:click={createTaskModal}
				>
					New Task
				</button>
			</div>
		</div>
	</div>
</div>

<!-- Create Checklist Modal -->
<InputModal
	modalTitle="Create Checklist"
	bind:inputModalActive={createChecklistModalActive}
	bind:onSubmit={createNewChecklist}
>
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
		<button class:loading={awaiting} class="btn btn-primary btn-lg border border-accent"
			>Create</button
		>
	</div>
</InputModal>

<!-- Create Task Modal -->
<InputModal
	modalTitle="Create Task"
	bind:inputModalActive={createTaskModalActive}
	bind:onSubmit={createNewTask}
>
	<div>
		<!-- Checklist Name Input -->
		<input
			bind:value={taskName}
			placeholder="Pack Warm Clothes"
			minlength="1"
			maxlength="255"
			id="taskName"
			type="text"
			class="w-full p-5 block rounded-xl bg-primary opacity-80 shadow-inner-2xl"
			required
		/>
	</div>

	<div class="flex justify-center">
		<!-- Submit Button -->
		<button class:loading={awaiting} class="btn btn-primary btn-lg border border-accent"
			>Create</button
		>
	</div>
</InputModal>

<!-- Delete Checklist Modal -->
<InputModal
	modalTitle="Delete Checklist"
	bind:inputModalActive={deleteChecklistModalActive}
	bind:onSubmit={deleteChecklist}
>
	<div>
		<h1 class="text-lg md:text-2xl py-10 text-center">
			Are you sure you want to delete this checklist?
		</h1>
	</div>

	<div class="flex justify-center">
		<!-- Submit Button -->
		<button class:loading={awaiting} class="btn btn-primary btn-lg border border-accent"
			>Delete</button
		>
	</div>
</InputModal>

<!-- Delete Task Modal -->
<InputModal
	modalTitle="Delete Task"
	bind:inputModalActive={deleteTaskModalActive}
	bind:onSubmit={deleteTask}
>
	<div>
		<h1 class="text-lg md:text-2xl py-10 text-center">
			Are you sure you want to delete this task?
		</h1>
	</div>

	<div class="flex justify-center">
		<!-- Submit Button -->
		<button class:loading={awaiting} class="btn btn-primary btn-lg border border-accent"
			>Delete</button
		>
	</div>
</InputModal>

<MessageModal bind:modalTitle bind:modalMessage bind:messageModalActive />
