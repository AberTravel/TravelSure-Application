// Import needed modules
import {
	getDocumentPromise,
	setDocumentPromise,
	deleteDocumentPromise,
	appendDocumentPromise
} from '$lib/database/operations/documents';
import {
	getSetPromise,
	addToSetPromise,
	deleteFromSetPromise
} from '$lib/database/operations/sets';
import { uuid } from 'uuidv4';
import type { User } from '$lib/types';

// Create a User
// @ts-ignore
export const createUser = async (email: string): Promise<any> => {
	if (!email) return false;
	try {
		await Promise.all([
			setDocumentPromise(`User`, email, {
				email: email,
				journeys: {},
				knownLogins: {}
			}),
			addToSetPromise('', 'Users', email)
		]);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Create an Empty Journey
// @ts-ignore
export const createEmptyJourney = async (email: string): Promise<any> => {
	if (!email) return false;
	try {
		// Check if user exists
		const user = (await getDocumentPromise(`User`, email)) as User;
		if (!user) return false;
		// Generates a UUIDv4 for the Journey Code
		let journeyCode = uuid();
		// Catches duplicates
		while (user.journeys[journeyCode]) journeyCode = uuid();
		// Adds the Empty Journey to the User
		await setDocumentPromise(
			`User`,
			email,
			{
				stops: [],
				// Set expiresOn to the current time + 6 months
				expiresOn: new Date(Date.now() + 518400000),
				checklists: [],
				essentialChecjklists: []
			},
			`$.journeys.${journeyCode}`
		);
		// Returns the journey code, to allow for adding of destinations
		return journeyCode;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Create a Journey Stop
// @ts-ignore
export const createJourneyStop = async (
	email: string,
	journeyCode: string,
	startAirport: string,
	destinationAirport: string,
	destination: string,
	arrival: string,
	departure: string
): Promise<any> => {
	if (
		!email ||
		!journeyCode ||
		!startAirport ||
		!destinationAirport ||
		!destination ||
		!arrival ||
		!departure
	)
		return false;
	try {
		// Appends the Stop to the Journey
		await appendDocumentPromise(
			`User`,
			email,
			{
				startAirport,
				destinationAirport,
				destination,
				arrival,
				departure
			},
			`$.journeys.${journeyCode}.stops`
		);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Read a User
export const getUser = async (email: string): Promise<any> => {
	if (!email) return false;
	try {
		return await getDocumentPromise(`User`, email);
	} catch (error) {
		console.log(error);
		return false;
	}
};

// Read all Users
export const getAllUsers = async (): Promise<any> => {
	try {
		const users = await getSetPromise('', `Users`);
		// Retrieve all Users into an Array of Objects
		return await Promise.all(users.map(async (user: string) => await getUser(user)));
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Read a Journey
export const getJourney = async (email: string, journeyCode: string): Promise<any> => {
	if (!email || !journeyCode) return false;
	try {
		return await getDocumentPromise(`User`, email, `$.journeys.${journeyCode}`);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Read all Journeys
export const getAllJourneys = async (email: string): Promise<any> => {
	if (!email) return false;
	try {
		return await getDocumentPromise(`User`, email, `$.journeys`);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Read a Journey Stop
export const getJourneyStop = async (
	email: string,
	journeyCode: string,
	stopIndex: number
): Promise<any> => {
	if (!email || !journeyCode || !stopIndex) return false;
	try {
		return await getDocumentPromise(`User`, email, `$.journeys.${journeyCode}.stops.${stopIndex}`);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Read all Journey Stops
export const getAllJourneyStops = async (email: string, journeyCode: string): Promise<any> => {
	if (!email || !journeyCode) return false;
	try {
		return await getDocumentPromise(`User`, email, `$.journeys.${journeyCode}.stops`);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Update a Journey
export const updateJourney = async (
	email: string,
	journeyCode: string,
	expiresOn: string
): Promise<any> => {
	if (!email || !journeyCode || !expiresOn) return false;
	try {
		return await setDocumentPromise(
			`User`,
			email,
			new Date(expiresOn),
			`$.journeys.${journeyCode}.expiresOn`
		);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Update a Stop
export const updateStop = async (
	email: string,
	journeyCode: string,
	stopIndex: number,
	startAirport: string,
	destinationAirport: string,
	destination: string,
	arrival: string,
	departure: string
): Promise<any> => {
	if (
		!email ||
		!journeyCode ||
		!stopIndex ||
		!startAirport ||
		!destinationAirport ||
		!destination ||
		!arrival ||
		!departure
	)
		return false;
	try {
		return await setDocumentPromise(
			`User`,
			email,
			{
				startAirport: startAirport,
				destinationAirport: destinationAirport,
				destination: destination,
				arrival: arrival,
				departure: departure
			},
			`$.journeys.${journeyCode}.stops.${stopIndex}`
		);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Delete a User
export const deleteUser = async (email: string): Promise<any> => {
	if (!email) return false;
	try {
		await Promise.all([
			deleteDocumentPromise(`User`, email),
			deleteFromSetPromise('', 'Users', email)
		]);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Delete a Journey
export const deleteJourney = async (email: string, journeyCode: string): Promise<any> => {
	if (!email || !journeyCode) return false;
	try {
		await deleteDocumentPromise(`User`, email, `$.journeys.${journeyCode}`);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Delete a Stop
export const deleteStop = async (
	email: string,
	journeyCode: string,
	stopIndex: number
): Promise<any> => {
	if (!email || !journeyCode || !stopIndex) return false;
	try {
		await deleteDocumentPromise(`User`, email, `$.journeys.${journeyCode}.stops.${stopIndex}`);
	} catch (error) {
		console.log(error);
		return null;
	}
};
