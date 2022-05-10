// Imports needed modules
import { INVALID_INPUT } from '$lib/responses';
import { isEmailValid, getIPFromXForwardedFor, isTextValid } from '$lib/security';
import { verify } from '$lib/user/auth';

// POST Request Handler
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	// Get the body from the request
	const body = await request.json();
	// Check to see if body, email, accessCode and ipCode are set
	if (!body || !body.email || !body.accessCode || !body.ipCode) return INVALID_INPUT;
	// Validate/Sanitise Input
	let email = isEmailValid(body.email);
	let accessCode = isTextValid(body.accessCode);
	let ipCode = isTextValid(body.ipCode);
	if (!email || !accessCode || !ipCode) return INVALID_INPUT;
	// Process the Login Request
	return await verify(email, accessCode, getIPFromXForwardedFor(request), ipCode);
};
