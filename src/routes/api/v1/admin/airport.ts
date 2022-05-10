// Import needed modules
import { isAdmin } from '$lib/security';
import {
	createAirport,
	getAirport,
	getAirports,
	updateAirportName,
	deleteAirport
} from '$lib/staff/airports';
import {
	ADMIN_NOT_AUTHORISED,
	AIRPORT_ALREADY_EXISTS,
	AIRPORT_CREATED,
	AIRPORT_DELETED,
	AIRPORT_NOT_FOUND,
	AIRPORT_UPDATED,
	DATABASE_ERROR,
	INVALID_INPUT
} from '$lib/responses';
import { isTextValid } from '$lib/security';

// GET Request Handler (getAirport and getAirports)
// @ts-ignore
export const get = async ({ request, url }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;
	// Get the airport ID from the URL (if present)
	let airportID = url.searchParams.get('airportID');
	// Check if airportID is set
	if (airportID) {
		// Validate/Sanitise Input
		airportID = isTextValid(airportID);
		if (!airportID) return INVALID_INPUT;
		const airport = await getAirport(airportID);
		// Check to see if Airport exists
		if (airport == null) return AIRPORT_NOT_FOUND;
		// Check to see if the Database is down
		if (!airport) return DATABASE_ERROR;
		return {
			status: 200,
			body: airport
		};
	} else {
		// Read the airports
		const airports = await getAirports();
		// Check to see if an Airport has been found
		if (airports.length == 0) return AIRPORT_NOT_FOUND;
		// Check to see if the Database is down
		if (!airports) return DATABASE_ERROR;
		return {
			status: 200,
			body: airports
		};
	}
};

// POST Request Handler (createAirport)
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if body, airportID and airportName are set
	if (!body || !body.airportID || !body.airportName) return INVALID_INPUT;

	// Validate/Sanitise Input
	let airportID = isTextValid(body.airportID);
	let airportName = isTextValid(body.airportName);
	if (!airportID || !airportName) return INVALID_INPUT;

	// Check to see if Airport exists
	let airport = await getAirport(airportID);
	if (airport != null) return AIRPORT_ALREADY_EXISTS;

	// Create the Airport
	airport = await createAirport(airportID, airportName);

	// Check to see if the Airport was created
	if (!airport) return DATABASE_ERROR;
	return AIRPORT_CREATED;
};

// PUT Request Handler (updateAirport)
// @ts-ignore
export const put = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if body, airportID and airportName are set
	if (!body || !body.airportID || !body.airportName) return INVALID_INPUT;

	// Validate/Sanitise Input
	let airportID = isTextValid(body.airportID);
	let airportName = isTextValid(body.airportName);
	if (!airportID || !airportName) return INVALID_INPUT;

	// Check to see if Airport exists
	let airport = await getAirport(airportID);
	if (airport == null) return AIRPORT_NOT_FOUND;

	// Check to see if the Database is down
	if (!airport) return DATABASE_ERROR;

	// Update the Airport
	airport = await updateAirportName({ id: airportID, name: airportName });
	// Check to see if the Airport was updated
	if (!airport) return DATABASE_ERROR;

	return AIRPORT_UPDATED;
};

// DELETE Request Handler (deleteAirport)
// @ts-ignore
export const del = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if body and airportID are set
	if (!body || !body.airportID) return INVALID_INPUT;

	// Validate/Sanitise Input
	let airportID = isTextValid(body.airportID);
	if (!airportID) return INVALID_INPUT;

	// Check to see if Airport exists
	let airport = await getAirport(airportID);
	if (airport == null) return AIRPORT_NOT_FOUND;

	// Check to see if the Database is down
	if (!airport) return DATABASE_ERROR;

	// Delete the Airport
	airport = await deleteAirport(airportID);

	// Check to see if the Airport was deleted
	if (!airport) return DATABASE_ERROR;

	return AIRPORT_DELETED;
};
