// Import needed modules
import type { User, UserStop, Airport } from '$lib/types';
import {
	setDocumentPromise,
	getDocumentPromise,
	deleteDocumentPromise
} from '$lib/database/operations/documents';
import {
	getSetPromise,
	addToSetPromise,
	deleteFromSetPromise
} from '$lib/database/operations/sets';
import { getAllUsers } from '$lib/staff/user';
import { sendEmail } from '$lib/mailer/operations/sendEmail';

// Create a Airport
export const createAirport = async (airportID: string, airportName: string): Promise<any> => {
	if (!airportID || !airportName) return false;
	try {
		await Promise.all([
			setDocumentPromise(`Airport`, airportID, { id: airportID, name: airportName }),
			addToSetPromise('', 'Airports', airportID)
		]);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Get a Airport
export const getAirport = async (id: string): Promise<any> => {
	if (!id) return false;
	try {
		return await getDocumentPromise(`Airport`, id);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Get all Airports
export const getAirports = async (): Promise<any> => {
	try {
		const airports = await getSetPromise('', `Airports`);
		// Retrieve all Airports into an Array of Objects
		return await Promise.all(airports.map(async (airport: string) => await getAirport(airport)));
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Update a Airport (Name)
export const updateAirportName = async (airport: Airport): Promise<boolean> => {
	if (!airport.id || !airport.name) return false;
	try {
		await setDocumentPromise(`Airport`, airport.id, airport);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Delete a Airport
export const deleteAirport = async (id: string): Promise<boolean> => {
	if (!id) return false;
	try {
		await Promise.all([
			deleteDocumentPromise(`Airport`, id),
			deleteFromSetPromise('', `Airports`, id)
		]);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Send Email to Consumer with Specific Airport (current date or future date)
export const sendAirportUpdateEmail = async (
	id: string,
	subject: string,
	message: string
): Promise<any> => {
	if (!id) return false;
	try {
		// Get all users
		const users = (await getAllUsers()) as User[];
		// Send email to all users
		await Promise.all(
			users.map(async (user: any) => {
				if (user && user.email) {
					// Found Specific Airport?
					let occurence = false;
					// Retrieve User journeys
					const journeys = user.journeys;
					// Loop through Journeys Object
					for (const journey in journeys) {
						// Loop through Stops
						for (const stop in journeys[journey].stops) {
							const stopData = journeys[journey].stops[stop] as UserStop;
							// Check if stopData matches the startAirport and arrival is in the future or today
							if (stopData.startAirport === id && new Date(stopData.arrival) >= new Date())
								occurence = true;
							// Check if Stop matches the destinationAirport and departure is in the future or today
							if (stopData.destinationAirport === id && new Date(stopData.departure) >= new Date())
								occurence = true;
						}
					}
					// If occurence is true, send email
					if (occurence) await sendEmail(user.email, subject, message);
				}
			})
		);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};
