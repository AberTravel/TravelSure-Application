// Import needed modules
import { getDocumentPromise, setDocumentPromise } from '$lib/database/operations/documents';
import {
	GOOGLE_CACHE_TIME,
	GOOGLE_MAPS_API,
	GOOGLE_MAPS_KEY,
	GOOGLE_MAPS_SEARCH_RADIUS,
	WEATHER_API,
	WEATHER_CACHE_TIME,
	WEATHER_KEY
} from '$lib/env';
import { DATABASE_ERROR, INVALID_ACCOUNT } from '$lib/responses';
import type { Destination, Session, User } from '$lib/types';

// Defination for Destination Location Type enum
enum DestinationLocationType {
	CAR_RENTAL = 'car_rental',
	TOURIST_ATTRACTION = 'tourist_attraction',
	RESTAURANT = 'restaurant'
}

// Destination Location Retrieval Function
const getLocationData = async (
	destination: string,
	locationType: DestinationLocationType
): Promise<any> => {
	try {
		// Retrieve the Destination
		const destinationDocument = (await getDocumentPromise(
			`Destination`,
			destination
		)) as Destination;
		// Check if the Destination exists
		if (!destinationDocument) return DATABASE_ERROR;
		// Checks if destination location data exists and is still valid, if so returns it
		if (
			destinationDocument.destinationInfo[`${locationType}`] != undefined &&
			new Date(destinationDocument.destinationInfo[`${locationType}`].nextUpdate) > new Date()
		)
			return destinationDocument.destinationInfo[`${locationType}`];

		// Retrieves the Place Data
		const data = await (
			await fetch(
				`${GOOGLE_MAPS_API}/place/nearbysearch/json?location=${destinationDocument.latitude},${destinationDocument.longitude}&radius=${GOOGLE_MAPS_SEARCH_RADIUS}&rankby=prominence&type=${locationType}&keyword=${destinationDocument.location}&key=${GOOGLE_MAPS_KEY}`
			)
		).json();
		// Parses the data into a easy format, with any additionally required infromation (such as next update) - for 5 results
		const locationData = {
			nextUpdate: new Date(new Date().getTime() + parseFloat(GOOGLE_CACHE_TIME ?? '0') * 1000)
				.toISOString()
				.split('T')[0],
			results: data.results
				.slice(0, 5)
				.map(
					(result: {
						name: any;
						vicinity: any;
						rating: any;
						user_ratings_total: any;
						price_level: any;
					}) => {
						return {
							name: result.name,
							address: result.vicinity,
							rating: result.rating,
							totalReviews: result.user_ratings_total,
							priceLevel: result.price_level
						};
					}
				)
		};
		// Sets the Restaurants Data to the Destination Document
		await setDocumentPromise(
			'Destination',
			destination,
			locationData,
			`destinationInfo.${locationType}`
		);
		// Return upto date location data
		return locationData;
	} catch (error) {
		console.log(error);
		return DATABASE_ERROR;
	}
};

// Destination Weather Retrieval Function
const getWeatherData = async (destination: string): Promise<any> => {
	try {
		// Retrieve Destination
		const destinationDocument = (await getDocumentPromise(
			'Destination',
			destination
		)) as Destination;
		// Check if the Destination exists
		if (!destinationDocument) return DATABASE_ERROR;
		// Checks if weather data exists and is still valid, if so returns it
		if (
			destinationDocument.destinationInfo.weather != undefined &&
			new Date(destinationDocument.destinationInfo.weather.nextUpdate).getTime() >
				new Date().getTime()
		)
			return destinationDocument.destinationInfo.weather;
		// Retrieves the Data
		const data = await (
			await fetch(
				`${WEATHER_API}/data/2.5/weather?units=metric&lat=${destinationDocument.latitude}&lon=${destinationDocument.longitude}&appid=${WEATHER_KEY}`
			)
		).json();
		// Parses the data into a easy format, with any additionally required infromation (such as next update)
		const weather = {
			nextUpdate: new Date(new Date().getTime() + parseFloat(WEATHER_CACHE_TIME ?? '0') * 1000)
				.toISOString()
				.split('T')[0],
			weather: data.weather[0].main,
			weatherDescription: data.weather[0].description
				.split(' ')
				.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' '),
			currentTemp: data.main.temp + ' Celsius',
			lowestTemp: data.main.temp_min + ' Celsius',
			highestTemp: data.main.temp_max + ' Celsius',
			wind: data.wind.speed + ' m/s'
		};
		// Sets the Weather Data to the Destination Document
		await setDocumentPromise('Destination', destination, weather, `destinationInfo.weather`);
		// Return upto date weather data
		return weather;
	} catch (error) {
		console.log(error);
		return DATABASE_ERROR;
	}
};

// Destination Data Payload Retrieval Function
export const getDestinationData = async (sessionToken: string): Promise<any> => {
	try {
		// Retrieve Session
		const session = (await getDocumentPromise('Session', sessionToken)) as Session;
		// Check to see if session is valid
		if (!session) return INVALID_ACCOUNT;
		// Retrieve Email and AccessCode
		const [email, accessCode] = [session.email, session.accessCode];
		// Retrieve User Data
		const userData = (await getDocumentPromise('User', email)) as User;
		// Check to see if user exists
		if (!userData) return INVALID_ACCOUNT;
		// Retrieve Journey
		const journey = userData.journeys[accessCode];
		// Check if journey exists
		if (!journey) return INVALID_ACCOUNT;

		// Multi-stop payload
		let payload = {
			journeyCode: accessCode,
			expiresOn: journey.expiresOn,
			stops: []
		};

		// Loop through all the stops in the journey
		for (let i = 0; i < journey.stops.length; i++) {
			// Get stop data from user
			const stop = journey.stops[i];

			// Check if current stop is still valid
			if (new Date(stop.departure) < new Date()) continue;

			const [
				destination,
				startAirport,
				destinationAirport,
				weather,
				restaurant,
				attractions,
				carRentals
			] = await Promise.all([
				getDocumentPromise('Destination', stop.destination),
				getDocumentPromise('Airport', stop.startAirport),
				getDocumentPromise('Airport', stop.destinationAirport),
				getWeatherData(stop.destination),
				getLocationData(stop.destination, DestinationLocationType.RESTAURANT),
				getLocationData(stop.destination, DestinationLocationType.TOURIST_ATTRACTION),
				getLocationData(stop.destination, DestinationLocationType.CAR_RENTAL)
			]);

			payload.stops.push({
				// @ts-ignore
				country: destination.country,
				// @ts-ignore
				city: destination.location,
				// @ts-ignore
				countryCode: destination.countryCode,
				// @ts-ignore
				emergencyNumber: destination.emergencyNumber,
				// @ts-ignore
				startAirport: startAirport.name,
				// @ts-ignore
				arrival: stop.arrival,
				// @ts-ignore
				destinationAirport: destinationAirport.name,
				// @ts-ignore
				departure: stop.departure,
				// @ts-ignore
				weather: weather,
				// @ts-ignore
				restaurant: restaurant,
				// @ts-ignore
				attractions: attractions,
				// @ts-ignore
				carRentals: carRentals
			});
		}

		// Return the payload and success
		return {
			status: 200,
			body: {
				payload
			}
		};
	} catch (error) {
		console.log(error);
		return DATABASE_ERROR;
	}
};
