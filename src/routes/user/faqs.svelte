<!-- SSR/Client -->
<script context="module" lang="ts">
	// @ts-ignore
	export const load = async ({ fetch }) => {
		// Send a request to the server
		let faqData = await (
			await fetch(`/api/v1/user/feed?feedType=FAQItems`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json();

		return {
			props: {
				faqData
			}
		};
	};
</script>

<!-- Client-Side -->
<script lang="ts">
	// Import Database Error
	import { DATABASE_ERROR } from '$lib/responses';
	import type { FeedItem } from '$lib/types';

	// Gets the data from the server through the load request
	export let faqData: Array<FeedItem>;

	$: toggles = [];
</script>

<div class="pb-20 lg:container lg:mx-auto">
	<h1 class="text-primary-content text-3xl md:text-6xl font-bold p-10 pb-16 text-center">
		Frequently Asked Questions
	</h1>

	<div class="border-y-2 xl:border-x-2 border-primary bg-secondary">
		<!-- Check if faqData is undefined -->
		{#if faqData.length == undefined}
			<div class="text-center px-4 md:px-14 min-w-full bg-secondary text-secondary-content py-10">
				<h2 class="text-2xl md:text-4xl py-10">{DATABASE_ERROR.body.message}</h2>
				<div class="md:px-4 text-base xs:text-lg md:text-xl space-y-5 pb-14">
					<p>{DATABASE_ERROR.body.message}</p>
				</div>
				<span class="hidden">{location.reload()}</span>
			</div>
		{:else}
			{#each faqData as item, i}
				<!-- Add item title to dictionary if not exists -->
				{#if toggles[i] === undefined}
					<span class="hidden">{(toggles[i] = false)}</span>
				{/if}

				<div class="px-4 md:px-14 min-w-full bg-secondary text-secondary-content py-10">
					<div tabindex="0" class="text-2xl collapse">
						<input
							id={item.title}
							aria-label="Toggle {item}"
							type="checkbox"
							bind:checked={toggles[i]}
						/>

						<div class="collapse-title text-xl font-medium">
							<div class="flex justify-between">
								<h2 class="text-2xl md:text-4xl py-10">{item.title}</h2>
								{#if toggles[i]}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-10 w-10 mt-10 sm:h-14 sm:w-14 sm:mt-8"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
									</svg>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-10 w-10 mt-10 sm:h-14 sm:w-14 sm:mt-8"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
									</svg>
								{/if}
							</div>
						</div>

						<div class="collapse-content">
							<div class="md:px-4 text-base xs:text-lg md:text-xl space-y-5 pb-14">
								{#each item.content as content}
									<p>{content}</p>
								{/each}
							</div>
						</div>
					</div>
				</div>

				{#if i < faqData.length - 1}
					<div class="mx-10 border-b border-accent-content" />
				{/if}
			{/each}
		{/if}
	</div>
</div>
