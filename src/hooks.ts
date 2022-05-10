// Import needed modules
import { getIPFromXForwardedFor } from '$lib/security';
import { validateSession } from '$lib/user/auth';
import { parse } from 'cookie';

// Session Request Handler (called before every route)
// @ts-ignore
export const getSession = async ({ request }) => {
	// Retrieve Token from Cookie
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';
	// Process Validation Request
	return await validateSession(sessionToken, getIPFromXForwardedFor(request));
};
