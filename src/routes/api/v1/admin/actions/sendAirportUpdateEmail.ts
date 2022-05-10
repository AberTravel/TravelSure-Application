// Import needed modules
import { isAdmin, isTextValid } from '$lib/security';
import {
	ADMIN_NOT_AUTHORISED,
	AIRPORT_UPDATE_EMAIL_SENT,
	INVALID_INPUT,
	UNKNOWN_ERROR
} from '$lib/responses';
import { sendAirportUpdateEmail } from '$lib/staff/airports';

// POST Request Handler (sendAirportUpdateEmail)
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;
	const body = await request.json();

	// Check to see if body, airportID, message and subject are set
	if (!body || !body.airportID || !body.message || !body.subject) return INVALID_INPUT;

	// Validate/Sanitise Input
	let airportID = isTextValid(body.airportID);
	let message = isTextValid(body.message);
	let subject = isTextValid(body.subject);
	if (!airportID || !message || !subject) return INVALID_INPUT;

	// Send the Email
	const email = await sendAirportUpdateEmail(airportID, subject, message);

	// Check to see if the Email was sent
	if (!email) return UNKNOWN_ERROR;
	return AIRPORT_UPDATE_EMAIL_SENT;
};
