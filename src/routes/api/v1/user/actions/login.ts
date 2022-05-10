// Imports needed modules
import { INVALID_INPUT } from '$lib/responses';
import { isEmailValid, getIPFromXForwardedFor, isTextValid } from '$lib/security';
import { login } from '$lib/user/auth';
export const get = async () => {
	return INVALID_INPUT;
};

// POST Request Handler
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	// Get the body from the request
	const body = await request.json();
	// Check to see if body, email and accessCode are set
	if (!body || !body.email || !body.accessCode) return INVALID_INPUT;
	// Validate/Sanitise Input
	let email = isEmailValid(body.email);
	let accessCode = isTextValid(body.accessCode);
	if (!email || !accessCode) return INVALID_INPUT;
	// Process the Login Request
	return await login(email, accessCode, getIPFromXForwardedFor(request));
};
