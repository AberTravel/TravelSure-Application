<!-- SSR/Client-side -->
<script context="module" lang="ts">
	// @ts-ignore
	export const load = async ({ fetch }) => {
		// Send a request to the server
		let destinationData = await (
			await fetch(`/api/v1/user/destination`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json();

		return {
			props: {
				destinationData
			}
		};
	};
</script>

<!-- Client-side -->
<script lang="ts">
	// @ts-ignore
	export let destinationData;
</script>

<div class="pb-20 lg:container lg:mx-auto">
	<div class="flex justify-center space-x-10 p-10">
		<h1 class="text-primary-content text-5xl md:text-6xl font-bold text-center">Destination</h1>
	</div>

	<div class="text-primary-content">
		{#each destinationData['payload']['stops'] as stop, i}
			<!-- Title -->
			<h2 class="text-3xl md:text-5xl py-10 text-center">{stop.city} ({stop.countryCode})</h2>

			<!-- Map and Weather/Location Infromation -->
			<div class="flex flex-col xl:flex-row xl:space-x-8 space-y-8 xl:space-y-0">
				<!-- Location/Weather -->
				<div class="w-full xl:w-2/4">
					<div
						class="bg-secondary p-8 md:px-16 md:py-10 rounded-3xl shadow-xl border border-accent h-full flex flex-col"
					>
						<!-- Information -->
						<div>
							<h3 class="text-center text-primary-content text-2xl md:text-3xl font-bold">
								Destination
							</h3>
							<div class="md:px-4 text-base xs:text-lg md:text-xl space-y-2 py-5">
								<p>Arriving From: {stop.startAirport}</p>
								<p>Arrival: {stop.arrival}</p>
								<p>Arriving To: {stop.destinationAirport}</p>
								<p>Emergency Number: {stop.emergencyNumber}</p>
								<p>Departure: {stop.departure}</p>
							</div>
						</div>
						<br />
						<!-- Weather -->
						<div>
							<h3 class="text-center text-primary-content text-2xl md:text-3xl font-bold">
								Weather
							</h3>
							<h4 class="text-center text-primary-content md:text-lg font-bold pt-4">
								Next Update: {stop.weather.nextUpdate}
							</h4>
							<div class="md:px-4 text-base xs:text-lg md:text-xl space-y-2 py-5">
								<p>Currently: {stop.weather.weatherDescription}</p>
								<p>Current Temperature: {stop.weather.currentTemp}</p>
								<p>Highest Temperature Today: {stop.weather.highestTemp}</p>
								<p>Lowest Temperature Today: {stop.weather.lowestTemp}</p>
								<p>Wind: {stop.weather.wind}</p>
							</div>
						</div>
					</div>
				</div>
				<!-- Map -->
				<div class="w-full">
					<iframe
						title="{stop.city} / {stop.country}"
						class="w-full h-192 border border-accent-content"
						allowfullscreen
						src="https://www.google.com/maps/embed/v1/search?key=AIzaSyCUfC6wT75hsi9OrpKel8FvF3aTlk6HX-4
                            &q={stop.city}+{stop.country}&zoom=18&maptype=satellite"
					/>
				</div>
			</div>

			<!-- Tourist Attraction -->
			<div class="min-w-full text-secondary-content">
				<!-- Title -->
				<h2 class="text-3xl md:text-5xl py-10 text-center">Tourist Attractions</h2>
				<div
					class="flex flex-col 2xl:flex-row 2xl:space-x-8 space-y-8 2xl:space-y-0 justify-center min-h-full w-full"
				>
					<!-- Content -->
					{#each stop.attractions.results as attraction}
						<div
							class="bg-secondary p-8 md:px-16 md:py-10 rounded-3xl shadow-xl border border-accent min-h-full w-full"
						>
							<div class="md:px-4 text-base xs:text-lg md:text-xl space-y-2 min-h-full w-full">
								<h3 class="text-center text-primary-content text-2xl md:text-3xl font-bold">
									{attraction.name}
								</h3>
								<p class="text-center text-primary-content md:text-lg font-bold pt-4">
									{attraction.address}
								</p>
								<br />
								<p>Rating: {attraction.rating}</p>
								<p>Total Reviews: {attraction.totalReviews}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Resteraunt -->
			<div class="min-w-full text-secondary-content">
				<!-- Title -->
				<h2 class="text-3xl md:text-5xl py-10 text-center">Local Restaurants</h2>
				<div
					class="flex flex-col 2xl:flex-row 2xl:space-x-8 space-y-8 2xl:space-y-0 justify-center min-h-full w-full"
				>
					<!-- Content -->
					{#each stop.restaurant.results as restaurant}
						<div
							class="bg-secondary p-8 md:px-16 md:py-10 rounded-3xl shadow-xl border border-accent min-h-full w-full"
						>
							<div class="md:px-4 text-base xs:text-lg md:text-xl space-y-2 min-h-full w-full">
								<h3 class="text-center text-primary-content text-2xl md:text-3xl font-bold">
									{restaurant.name}
								</h3>
								<p class="text-center text-primary-content md:text-lg font-bold pt-4">
									{restaurant.address}
								</p>
								<br />
								<p>Rating: {restaurant.rating}</p>
								<p>Total Reviews: {restaurant.totalReviews}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Car Rental -->

			<div class="min-w-full text-secondary-content">
				<!-- Title -->
				<h2 class="text-3xl md:text-5xl py-10 text-center">Car Rental Services</h2>
				<div
					class="flex flex-col 2xl:flex-row 2xl:space-x-8 space-y-8 2xl:space-y-0 justify-center min-h-full w-full"
				>
					<!-- Content -->
					{#each stop.carRentals.results as carRentals}
						<div
							class="bg-secondary p-8 md:px-16 md:py-10 rounded-3xl shadow-xl border border-accent min-h-full w-full"
						>
							<div class="md:px-4 text-base xs:text-lg md:text-xl space-y-2 min-h-full w-full">
								<h3 class="text-center text-primary-content text-2xl md:text-3xl font-bold">
									{carRentals.name}
								</h3>
								<p class="text-center text-primary-content md:text-lg font-bold pt-4">
									{carRentals.address}
								</p>
								<br />
								<p>Rating: {carRentals.rating}</p>
								<p>Total Reviews: {carRentals.totalReviews}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			{#if i < destinationData['payload']['stops'].length - 1}
				<div class="mx-10 py-10 border-b border-accent-content" />
			{/if}
		{/each}
	</div>
</div>
