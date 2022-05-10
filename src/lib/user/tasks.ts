// Import needed modules
import { getDocumentPromise, setDocumentPromise } from '$lib/database/operations/documents';
import { DATABASE_ERROR, INVALID_ACCOUNT } from '$lib/responses';
import type { Session, User, UserJourney } from '$lib/types';

// Task Delete Function
export const deleteTask = async (sessionToken: string, checklist: number, taskName: string) => {
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
		// Delete Task from Checklist
		delete items[taskName];
		// Update the user's checklist
		await setDocumentPromise(
			'User',
			email,
			items,
			`$.journeys.${accessCode}.checklists[${checklist}].items`
		);
		// Return success
		return {
			status: 200,
			body: {
				message: 'Task Deleted'
			}
		};
	} catch (error) {
		console.log(error);
		return DATABASE_ERROR;
	}
};

// Task Create Function
export const createTask = async (sessionToken: string, checklist: number, taskName: string) => {
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
		// Add new Task to Checklist Items
		items[taskName] = false;
		// Update the user's checklist
		await setDocumentPromise(
			'User',
			email,
			items,
			`$.journeys.${accessCode}.checklists[${checklist}].items`
		);
		// Return success
		return {
			status: 200,
			body: {
				message: 'Task Deleted'
			}
		};
	} catch (error) {
		console.log(error);
		return DATABASE_ERROR;
	}
};
