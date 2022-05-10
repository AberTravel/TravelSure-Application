// Imports needed modules

import { INVALID_INPUT } from '$lib/responses';
import { isTextValid } from '$lib/security';
import { getUserFeed } from '$lib/user/feed';
import { parse } from 'cookie';

// GET Request Handler
// @ts-ignore
export const get = async ({ request, url }): Promise<any> => {
	/// Get the feed type from the URL (if present)
	let feed = url.searchParams.get('feedType');
	// Check to see if feed is valid
	if (!feed) return INVALID_INPUT;
	// Validate/Sanitise Input
	feed = isTextValid(feed);
	// Check to see if feed is valid
	if (!feed) return INVALID_INPUT;
	// Retrieve Token from Cookie
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';
	// Retrieve User Feed
	return await getUserFeed(sessionToken, feed);
};
