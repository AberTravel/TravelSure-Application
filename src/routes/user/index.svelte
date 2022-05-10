<!-- SSR/Client -->
<script context="module" lang="ts">
	// @ts-ignore
	export const load = async ({ fetch }) => {
		// Send a request to the server
		let homeData = await (
			await fetch(`/api/v1/user/feed?feedType=HomeItems`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json();

		return {
			props: {
				homeData
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
	export let homeData: Array<FeedItem>;
</script>

<div class="pb-20 lg:container lg:mx-auto">
	<h1 class="text-primary-content text-3xl md:text-6xl font-bold p-10 pb-16 text-center">
		What can I do?
	</h1>

	<div class="border-y-2 xl:border-x-2 border-primary bg-secondary">
		<!-- Check if homeData is undefined -->
		{#if homeData.length == undefined}
			<div class="text-center px-4 md:px-14 min-w-full bg-secondary text-secondary-content">
				<h2 class="text-2xl md:text-4xl py-10">An Error has Occurred</h2>
				<div class="md:px-4 text-base xs:text-lg md:text-xl space-y-5 pb-14">
					<p>{DATABASE_ERROR.body.message}</p>
				</div>
				<span class="hidden">{location.reload()}</span>
			</div>
		{:else}
			<!-- Loop through homeData and print title and content -->
			{#each homeData as item, i}
				<div class="px-4 md:px-14 min-w-full bg-secondary text-secondary-content">
					<h2 class="text-2xl md:text-4xl py-10">{item.title}</h2>
					<div class="md:px-4 text-base xs:text-lg md:text-xl space-y-5 pb-14">
						{#each item.content as content}
							<p>{content}</p>
						{/each}
					</div>
				</div>
				{#if i < homeData.length - 1}
					<div class="mx-10 border-b border-accent-content" />
				{/if}
			{/each}
		{/if}
	</div>
</div>
