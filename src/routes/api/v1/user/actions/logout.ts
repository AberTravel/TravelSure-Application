// Imports needed modules
import { logout } from '$lib/user/auth';
import { parse } from 'cookie';

// POST Request Handler
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	// Retrieve Token from
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';
	// Process the Logout Request
	return await logout(sessionToken);
};
