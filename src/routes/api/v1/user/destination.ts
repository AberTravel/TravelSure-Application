// Imports needed modules

import { getDestinationData } from '$lib/user/destination';
import { parse } from 'cookie';

// GET Request Handler
// @ts-ignore
export const get = async ({ request }): Promise<any> => {
	// Retrieve Token from Cookie
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';
	// Retrieve User Destination Information
	return await getDestinationData(sessionToken);
};
