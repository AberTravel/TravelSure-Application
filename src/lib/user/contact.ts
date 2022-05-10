// Import needed modules
import { getDocumentPromise } from '$lib/database/operations/documents';
import { sendSupportEmail } from '$lib/mailer/operations/sendEmail';
import { DATABASE_ERROR, EMAIL_SENT, INVALID_ACCOUNT } from '$lib/responses';
import type { Session } from '$lib/types';

// Contact Us Function
export const contact = async (
	name: string,
	email: string,
	message: string,
	sessionToken: string
): Promise<any> => {
	try {
		// Retrieve Session
		const session = (await getDocumentPromise('Session', sessionToken)) as Session;
		// Check to see if session is valid
		if (!session) return INVALID_ACCOUNT;
		// Send Email
		await sendSupportEmail(name, email, message);
		// Return Success
		return EMAIL_SENT;
	} catch (error) {
		console.log(error);
		// Return Failure
		return DATABASE_ERROR;
	}
};
