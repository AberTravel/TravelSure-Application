// Import needed modules
import { INVALID_INPUT } from '$lib/responses';
import { isEmailValid, isTextValid } from '$lib/security';
import { contact } from '$lib/user/contact';
import { parse } from 'cookie';

// POST Request Handler
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	// Get the body from the request
	const body = await request.json();
	// Check to see if body, email, name and message are set
	if (!body || !body.email || !body.name || !body.message) return INVALID_INPUT;
	// Validate/Sanitise Input
	let email = isEmailValid(body.email);
	let name = isTextValid(body.name);
	let message = isTextValid(body.message);
	if (!email || !name || !message) return INVALID_INPUT;

	// Retrieve Token from
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';

	// Process the Contact Request
	return await contact(name, email, message, sessionToken);
};
