// Import needed modules
import { isAdmin, isTextValid } from '$lib/security';
import {
	ADMIN_NOT_AUTHORISED,
	DESTINATION_UPDATE_EMAIL_SENT,
	INVALID_INPUT,
	UNKNOWN_ERROR
} from '$lib/responses';
import { sendDestinationUpdateEmail } from '$lib/staff/destinations';

// POST Request Handler (sendDestinationUpdateEmail)
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;
	const body = await request.json();

	// Check to see if body, destinationCountryCode, destinationLocation, message and subject are set
	if (
		!body ||
		!body.destinationCountryCode ||
		!body.destinationLocation ||
		!body.message ||
		!body.subject
	)
		return INVALID_INPUT;

	// Validate/Sanitise Input
	let destinationCountryCode = isTextValid(body.destinationCountryCode);
	let destinationLocation = isTextValid(body.destinationLocation);
	let message = isTextValid(body.message);
	let subject = isTextValid(body.subject);
	if (!destinationCountryCode || !destinationLocation || !message || !subject) return INVALID_INPUT;

	// Send the Email
	const email = await sendDestinationUpdateEmail(
		destinationCountryCode,
		destinationLocation,
		subject,
		message
	);

	// Check to see if the Email was sent
	if (!email) return UNKNOWN_ERROR;
	return DESTINATION_UPDATE_EMAIL_SENT;
};
