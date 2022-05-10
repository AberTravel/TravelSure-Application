// Import needed modules
import { isAdmin, isEmailValid, isTextValid } from '$lib/security';
import {
	createUser,
	createEmptyJourney,
	createJourneyStop,
	getUser,
	getAllUsers,
	getJourney,
	getAllJourneys,
	getJourneyStop,
	getAllJourneyStops,
	updateJourney,
	updateStop,
	deleteUser,
	deleteJourney,
	deleteStop
} from '$lib/staff/user';
import {
	ADMIN_NOT_AUTHORISED,
	DATABASE_ERROR,
	INVALID_INPUT,
	USER_ALREADY_EXISTS,
	USER_CREATED,
	USER_DELETED,
	USER_JOURNEY_CREATED,
	USER_JOURNEY_DELETED,
	USER_JOURNEY_UPDATED,
	USER_NOT_FOUND,
	USER_STOP_CREATED,
	USER_STOP_DELETED,
	USER_STOP_UPDATED
} from '$lib/responses';

// GET Request Handler (getUser, getAllUsers, getJourney, getAllJourneys, getJourneyStop, getAllJourneyStops)
// @ts-ignore
export const get = async ({ request, url }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the requestType from the URL (if present)
	const requestType = url.searchParams.get('requestType');

	// Switch on the requestType
	switch (requestType) {
		case 'getUser':
			// Get the email from the URL (if present)
			let email = url.searchParams.get('email');
			if (!email) return INVALID_INPUT;
			// Validate/Sanitise Input
			email = isEmailValid(email);
			if (!email) return INVALID_INPUT;
			// Get the user
			const user = await getUser(email);
			// Check to see if the user was found
			if (!user) return USER_NOT_FOUND;
			// Return the user
			return {
				status: 200,
				body: user
			};
		case 'getAllUsers':
			// Read the users
			const users = await getAllUsers();
			// Check to see if the users were read
			if (!users) return DATABASE_ERROR;
			// Return the users
			return {
				status: 200,
				body: users
			};
		case 'getJourney':
			// Get the email and journeyId from the URL (if present)
			let journeyEmail = url.searchParams.get('email');
			let journeyId = url.searchParams.get('journeyId');
			if (!journeyEmail || !journeyId) return INVALID_INPUT;
			// Validate/Sanitise Input
			journeyEmail = isEmailValid(journeyEmail);
			journeyId = Number(journeyId);
			if (!journeyEmail || journeyId == null) return INVALID_INPUT;
			// Get the journey
			const journey = await getJourney(journeyEmail, journeyId);
			// Check to see if the journey was found
			if (!journey) return USER_NOT_FOUND;
			// Return the journey
			return {
				status: 200,
				body: journey
			};
		case 'getAllJourneys':
			// Get the email from the URL (if present)
			journeyEmail = url.searchParams.get('email');
			if (!journeyEmail) return INVALID_INPUT;
			// Validate/Sanitise Input
			journeyEmail = isEmailValid(journeyEmail);
			if (!journeyEmail) return INVALID_INPUT;
			// Get the journeys
			const journeys = await getAllJourneys(journeyEmail);
			// Check to see if the journeys were found
			if (!journeys) return USER_NOT_FOUND;
			// Return the journeys
			return {
				status: 200,
				body: journeys
			};
		case 'getJourneyStop':
			// Get the email, journeyId and stopIndex from the URL (if present)
			journeyEmail = url.searchParams.get('email');
			journeyId = url.searchParams.get('journeyId');
			let stopIndex = url.searchParams.get('stopIndex');
			if (!journeyEmail || !journeyId || !stopIndex) return INVALID_INPUT;
			// Validate/Sanitise Input
			journeyEmail = isEmailValid(journeyEmail);
			journeyId = isNumberValid(journeyId);
			stopIndex = isNumberValid(stopIndex);
			if (!journeyEmail || !journeyId || !stopIndex) return INVALID_INPUT;
			// Get the journeyStop
			const journeyStop = await getJourneyStop(journeyEmail, journeyId, stopIndex);
			// Check to see if the journeyStop was found
			if (!journeyStop) return USER_NOT_FOUND;
			// Return the journeyStop
			return {
				status: 200,
				body: journeyStop
			};
		case 'getAllJourneyStops':
			// Get the email, journeyId from the URL (if present)
			journeyEmail = url.searchParams.get('email');
			journeyId = url.searchParams.get('journeyId');
			if (!journeyEmail || !journeyId) return INVALID_INPUT;
			// Validate/Sanitise Input
			journeyEmail = isEmailValid(journeyEmail);
			journeyId = isNumberValid(journeyId);
			if (!journeyEmail || !journeyId) return INVALID_INPUT;
			// Get the journeyStops
			const journeyStops = await getAllJourneyStops(journeyEmail, journeyId);
			// Check to see if the journeyStops were found
			if (!journeyStops) return USER_NOT_FOUND;
			// Return the journeyStops
			return {
				status: 200,
				body: journeyStops
			};
		default:
			return INVALID_INPUT;
	}
};

// POST Request Handler (createUser, createEmptyJourney, createJourneyStop)
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if the body, email and requestType are set
	if (!body || !body.email || !body.requestType) return INVALID_INPUT;

	// Validate/Sanitise Input
	const email = isEmailValid(body.email);
	const requestType = isTextValid(body.requestType);
	if (!email || !requestType) return INVALID_INPUT;

	const user = await getUser(email);

	// Switch on the requestType
	switch (requestType) {
		case 'createUser':
			// Check to see if an account already exists for the email
			if (user) return USER_ALREADY_EXISTS;
			// Create the user
			const userCreated = await createUser(email);
			if (!userCreated) return DATABASE_ERROR;
			return USER_CREATED;
		case 'createEmptyJourney':
			// Check to see if an account exists for the email
			if (!user) return USER_NOT_FOUND;
			// Create the journey
			const journeyCreated = await createEmptyJourney(email);
			if (!journeyCreated) return DATABASE_ERROR;
			return USER_JOURNEY_CREATED;
		case 'createJourneyStop':
			// Check to see if an account exists for the email
			if (!user) return USER_NOT_FOUND;
			// Check to see if a journeyCode, startAirport, destinationAirport, destination, arrival and departure are set
			if (
				!body.journeyCode ||
				!body.startAirport ||
				!body.destinationAirport ||
				!body.destination ||
				!body.arrival ||
				!body.departure
			)
				return INVALID_INPUT;
			// Validate/Sanitise Input
			const journeyCode = isTextValid(body.journeyCode);
			const startAirport = isTextValid(body.startAirport);
			const destinationAirport = isTextValid(body.destinationAirport);
			const destination = isTextValid(body.destination);
			const arrival = isTextValid(body.arrival);
			const departure = isTextValid(body.departure);
			if (
				!journeyCode ||
				!startAirport ||
				!destinationAirport ||
				!destination ||
				!arrival ||
				!departure
			)
				return INVALID_INPUT;
			// Create the journey stop
			const stopCreated = await createJourneyStop(
				email,
				journeyCode,
				startAirport,
				destinationAirport,
				destination,
				arrival,
				departure
			);
			if (!stopCreated) return DATABASE_ERROR;
			return USER_STOP_CREATED;
		default:
			return INVALID_INPUT;
	}
};

// PUT Request Handler (updateJourney, updateStop)
// @ts-ignore
export const put = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if the body, email, journeyCode are set
	if (!body || !body.email || !body.journeyCode) return INVALID_INPUT;

	// Validate/Sanitise Input
	const email = isEmailValid(body.email);
	const journeyCode = isTextValid(body.journeyCode);
	if (!email || !journeyCode) return INVALID_INPUT;

	// Check if stopIndex
	if (body.stopIndex) {
		// Validate/Sanitise Input
		const stopIndex = isNumberValid(body.stopIndex);
		if (!stopIndex) return INVALID_INPUT;
		// Retrieve stop
		const stop = await getJourneyStop(email, journeyCode, parseFloat(stopIndex));
		// Check if stop exists
		if (!stop) return INVALID_INPUT;

		let [startAirport, destinationAirport, destination, arrival, departure] = [
			stop.startAirport,
			stop.destinationAirport,
			stop.destination,
			stop.arrival,
			stop.departure
		];

		// Check if startAirport is set
		if (body.startAirport) {
			// Validate/Sanitise Input
			startAirport = isTextValid(body.startAirport);
			if (!startAirport) return INVALID_INPUT;
			// Update startAirport
			startAirport = body.startAirport;
		}

		// Check if destinationAirport is set
		if (body.destinationAirport) {
			// Validate/Sanitise Input
			destinationAirport = isTextValid(body.destinationAirport);
			if (!destinationAirport) return INVALID_INPUT;
			// Update destinationAirport
			destinationAirport = body.destinationAirport;
		}

		// Check if destination is set
		if (body.destination) {
			// Validate/Sanitise Input
			destination = isTextValid(body.destination);
			if (!destination) return INVALID_INPUT;
			// Update destination
			destination = body.destination;
		}

		// Check if arrival is set
		if (body.arrival) {
			// Validate/Sanitise Input
			arrival = isTextValid(body.arrival);
			if (!arrival) return INVALID_INPUT;
			// Update arrival
			arrival = body.arrival;
		}

		// Check if departure is set
		if (body.departure) {
			// Validate/Sanitise Input
			departure = isTextValid(body.departure);
			if (!departure) return INVALID_INPUT;
			// Update departure
			departure = body.departure;
		}

		// Update stop
		await updateStop(
			email,
			journeyCode,
			parseFloat(stopIndex),
			startAirport,
			destinationAirport,
			destination,
			arrival,
			departure
		);
		return USER_STOP_UPDATED;
	}
	// Otherwise check if expiresOn is set
	else if (body.expiresOn) {
		// Validate/Sanitise Input
		const expiresOn = isTextValid(body.expiresOn);
		if (!expiresOn) return INVALID_INPUT;
		// Update the Journey
		await updateJourney(email, journeyCode, expiresOn);
		return USER_JOURNEY_UPDATED;
	}
	// Otherwise
	else return INVALID_INPUT;
};

// DELETE Request Handler (deleteUser, deleteJourney, deleteStop)
// @ts-ignore
export const del = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if the body, requestType, and email are set
	if (!body || !body.requestType || !body.email) return INVALID_INPUT;

	// Validate/Sanitise Input
	const requestType = isTextValid(body.requestType);
	const email = isEmailValid(body.email);
	if (!requestType || !email) return INVALID_INPUT;

	// Switch on the request type
	switch (requestType) {
		case 'deleteUser':
			await deleteUser(email);
			return USER_DELETED;
		case 'deleteJourney':
			// Check to see if the journeyCode is set
			if (!body.journeyCode) return INVALID_INPUT;
			const journeyCode = isTextValid(body.journeyCode);
			// Validate/Sanitise Input
			if (!journeyCode) return INVALID_INPUT;
			// Delete the Journey
			await deleteJourney(email, journeyCode);
			return USER_JOURNEY_DELETED;
		case 'deleteStop':
			// Check to see if the journeyCode and stopIndex are set
			if (!body.journeyCode || !body.stopIndex) return INVALID_INPUT;
			const journeyCodeForStop = isTextValid(body.journeyCode);
			// Validate/Sanitise Input
			if (!journeyCodeForStop) return INVALID_INPUT;
			const stopIndex = isNumberValid(body.stopIndex);
			if (!stopIndex) return INVALID_INPUT;
			// Delete the Stop
			await deleteStop(email, journeyCodeForStop, parseFloat(stopIndex));
			return USER_STOP_DELETED;
		default:
			return INVALID_INPUT;
	}
};
