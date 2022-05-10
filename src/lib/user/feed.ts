// Import needed modules
import { getDocumentPromise } from '$lib/database/operations/documents';
import { INVALID_ACCOUNT, ITEM_NOT_FOUND } from '$lib/responses';
import type { Session } from '$lib/types';

// Retrieve User Feed Function
export const getUserFeed = async (sessionToken: string, feed: string): Promise<any> => {
	try {
		// Retrieve Session
		const session = (await getDocumentPromise('Session', sessionToken)) as Session;
		// Check to see if session is valid
		if (!session) return INVALID_ACCOUNT;
		// Retrieve User's Feed
		const data = await getDocumentPromise('Staff', feed);
		// Check to see if data is valid
		if (!data) return ITEM_NOT_FOUND;
		// Return the data
		return {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			},
			body: data
		};
	} catch (error) {
		console.log(error);
		return null;
	}
};
