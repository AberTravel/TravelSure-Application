// Import needed modules
import {
	deleteDocumentPromise,
	getDocumentPromise,
	setDocumentPromise
} from '$lib/database/operations/documents';
import { DATABASE_ERROR, INVALID_ACCOUNT } from '$lib/responses';
import type { Session, User, UserJourney } from '$lib/types';

// Checklist Retrieval Function
export const getChecklist = async (sessionToken: string, checklist: number) => {
	try {
		// Retrieve Session
		const session = (await getDocumentPromise('Session', sessionToken)) as Session;
		// Check to see if session is valid
		if (!session) return INVALID_ACCOUNT;
		// Retrieve Email and AccessCode
		const [email, accessCode] = [session.email, session.accessCode];
		// Retrieve User Data
		const userData = (await getDocumentPromise('User', email)) as User;
		// Check to see if user exists
		if (!userData) return INVALID_ACCOUNT;
		// Retrieve Journey
		const journey = userData.journeys[accessCode] as UserJourney;
		// Check if journey exists
		if (!journey) return INVALID_ACCOUNT;

		// Return the user's checklist and success
		return {
			status: 200,
			body: {
				checklist: userData.journeys[accessCode].checklists[checklist],
				isThereNextChecklist: userData.journeys[accessCode].checklists.length > checklist + 1
			}
		};
	} catch (error) {
		console.log(error);
		return DATABASE_ERROR;
	}
};

// Checklist Update Function
export const updateChecklist = async (
	sessionToken: string,
	checklist: number,
	taskName: string,
	value: boolean
) => {
	try {
		// Retrieve Session
		const session = (await getDocumentPromise('Session', sessionToken)) as Session;
		// Check to see if session is valid
		if (!session) return INVALID_ACCOUNT;
		// Retrieve Email and AccessCode
		const [email, accessCode] = [session.email, session.accessCode];
		// Retrieve User Data
		const userData = (await getDocumentPromise('User', email)) as User;
		// Check to see if user exists
		if (!userData) return INVALID_ACCOUNT;
		// Retrieve Journey
		const journey = userData.journeys[accessCode] as UserJourney;
		// Check if journey exists
		if (!journey) return INVALID_ACCOUNT;

		// Get the specified checklist items
		const items = userData.journeys[accessCode].checklists[checklist].items;

		// Update the specified checklist item
		items[taskName] = value;

		// Update the user's checklist
		await setDocumentPromise(
			`User`,
			email,
			items,
			`$.journeys.${accessCode}.checklists[${checklist}].items`
		);

		// Return success
		return {
			status: 200,
			body: {
				message: 'Successfully updated checklist'
			}
		};
	} catch (error) {
		console.log(error);
		return DATABASE_ERROR;
	}
};

// Checklists Delete Function
export const deleteChecklist = async (sessionToken: string, checklist: number) => {
	try {
		// Retrieve Session
		const session = (await getDocumentPromise('Session', sessionToken)) as Session;
		// Check to see if session is valid
		if (!session) return INVALID_ACCOUNT;
		// Retrieve Email and AccessCode
		const [email, accessCode] = [session.email, session.accessCode];
		// Retrieve User Data
		const userData = (await getDocumentPromise('User', email)) as User;
		// Check to see if user exists
		if (!userData) return INVALID_ACCOUNT;
		// Retrieve Journey
		const journey = userData.journeys[accessCode] as UserJourney;
		// Check if journey exists
		if (!journey) return INVALID_ACCOUNT;
		// Delete from Document
		await deleteDocumentPromise('User', email, `$.journeys.${accessCode}.checklists[${checklist}]`);
		// Return success
		return {
			status: 200,
			body: {
				message: 'Successfully deleted checklist'
			}
		};
	} catch (error) {
		console.log(error);
		return DATABASE_ERROR;
	}
};

// Checklists Create Function
export const createChecklist = async (sessionToken: string, name: string) => {
	try {
		// Retrieve Session
		const session = (await getDocumentPromise('Session', sessionToken)) as Session;
		// Check to see if session is valid
		if (!session) return INVALID_ACCOUNT;
		// Retrieve Email and AccessCode
		const [email, accessCode] = [session.email, session.accessCode];
		// Retrieve User Data
		const userData = (await getDocumentPromise('User', email)) as User;
		// Check to see if user exists
		if (!userData) return INVALID_ACCOUNT;
		// Retrieve Journey
		const journey = userData.journeys[accessCode] as UserJourney;
		// Check if journey exists
		if (!journey) return INVALID_ACCOUNT;

		// Retrieve checklists
		let checklists = userData.journeys[accessCode].checklists;

		// Create new checklist
		let checklist = {
			name: name,
			items: {}
		};

		// Push checklist
		checklists.push(checklist);

		// Update the user's checklist
		await setDocumentPromise(`User`, email, checklists, `$.journeys.${accessCode}.checklists`);

		// Return success
		return {
			status: 200,
			body: {
				message: 'Successfully created checklist'
			}
		};
	} catch (error) {
		console.log(error);
		return DATABASE_ERROR;
	}
};
