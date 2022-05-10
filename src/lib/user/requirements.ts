// Import needed modules
import { getDocumentPromise, setDocumentPromise } from '$lib/database/operations/documents';
import { DATABASE_ERROR, INVALID_ACCOUNT } from '$lib/responses';
import type { Destination, Session, User, UserJourney } from '$lib/types';

// Requirement Checklist Retrieval Function
export const getRequirementChecklist = async (sessionToken: string): Promise<any> => {
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

		// Retrieve User Requirement Checklist
		const requirementsChecklist = journey.requirements;

		// Retrieve All Destinations from Stops
		let destinationDataFromStops = await Promise.all(
			journey.stops.map(async (stop) => {
				return (await getDocumentPromise('Destination', stop.destination)) as Destination;
			})
		);

		// Create a new dictionary to store all the requirements
		let newUserRequirements: {
			[key: string]: {
				[key: string]: {
					name: string;
					value: boolean;
				};
			};
		} = {};

		// Loop through stops
		for (let i = 0; i < destinationDataFromStops.length; i++) {
			// Retrieve Destination Code
			let destination = `${destinationDataFromStops[i].countryCode}/${destinationDataFromStops[i].location}`;

			// Check if destination exists
			if (!requirementsChecklist[destination]) continue;

			// Declare destination checklist
			newUserRequirements[destination] = {};

			// Retrieve Requirements and Checklist for Destination
			let requirements = destinationDataFromStops[i].requirements ?? {};
			let userDestinationChecklist = requirementsChecklist[destination];

			// Loop through requirements dictionary
			for (let requirement in requirements) {
				// Check value of requirement in userEssentialChecklist
				let userEssentialChecklistValue = false;

				// Check if user has a value for the requirement
				if (userDestinationChecklist[requirement] != undefined)
					userEssentialChecklistValue = userDestinationChecklist[requirement].value;

				// Add requirement to checklist
				newUserRequirements[destination][requirement] = {
					name: requirements[requirement],
					value: userEssentialChecklistValue
				};
			}
		}

		// Set newUserEssentialChecklist to User
		await setDocumentPromise(
			`User`,
			email,
			newUserRequirements,
			`$.journeys.${accessCode}.requirements`
		);

		// Return the requirement checklist and success
		return {
			status: 200,
			body: {
				requirements: newUserRequirements,
				isThereUserChecklist: journey.checklists.length > 0
			}
		};
	} catch (error) {
		// console.log(error);
		return DATABASE_ERROR;
	}
};

// Requirement Checklist Update Function
export const updateRequirementChecklist = async (
	sessionToken: string,
	destination: string,
	requirement: string,
	value: boolean
): Promise<any> => {
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
		await setDocumentPromise(
			`User`,
			email,
			value,
			`$.journeys.${accessCode}.requirements.${destination}.${requirement}.value`
		);
		return {
			status: 200,
			body: {
				message: 'Successfully updated requirement checklist'
			}
		};
	} catch (error) {
		console.log(error);
		return DATABASE_ERROR;
	}
};
