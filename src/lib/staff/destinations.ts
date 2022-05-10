// Import needed modules
import type { User, UserStop, Destination } from '$lib/types';
import {
	setDocumentPromise,
	getDocumentPromise,
	deleteDocumentPromise
} from '$lib/database/operations/documents';
import {
	getSetPromise,
	addToSetPromise,
	deleteFromSetPromise
} from '$lib/database/operations/sets';
import { getAllUsers } from '$lib/staff/user';
import { sendEmail } from '$lib/mailer/operations/sendEmail';
import { uuid } from 'uuidv4';

// Create a Destination
export const createDestination = async (
	destinationCountry: string,
	destinationLocation: string,
	destinationCountryCode: string,
	emergencyNumber: string,
	latitude: number,
	longitude: number
): Promise<any> => {
	if (
		!destinationCountry ||
		!destinationLocation ||
		!destinationCountryCode ||
		!emergencyNumber ||
		!latitude ||
		!longitude
	)
		return false;
	try {
		await Promise.all([
			setDocumentPromise(`Destination`, destinationCountry, {
				country: destinationCountry,
				location: destinationLocation,
				countryCode: destinationCountryCode,
				desintationInfo: {},
				emergencyNumber: emergencyNumber,
				latitude: latitude,
				longitude: longitude,
				requirements: {}
			}),
			addToSetPromise('', 'Destinations', destinationCountry)
		]);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Create a Requirement
export const createRequirement = async (
	destinationCountryCode: string,
	destinationLocation: string,
	requirement: string
): Promise<any> => {
	if (!destinationCountryCode || !destinationLocation || !requirement) return false;
	try {
		const destination = (await getDocumentPromise(
			`Destination`,
			`${destinationCountryCode}/${destinationLocation}`
		)) as Destination;
		if (!destination) return false;
		// Checks to see if the requirement already exists, looping through the requirements
		for (const requirementID in destination.requirements) {
			if (destination.requirements[requirementID] === requirement) return false;
		}
		// Generates a UUIDv4 ID for Requirement
		let requirementID = uuid();
		// Catches duplicates
		while (destination.requirements[requirementID]) requirementID = uuid();
		// Adds the requirement to the destination
		await setDocumentPromise(
			`Destination`,
			`${destinationCountryCode}/${destinationLocation}`,
			requirement,
			'$.requirements.' + requirementID
		);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Read a Destination
export const getDestination = async (id: string): Promise<any> => {
	if (!id) return false;
	try {
		return await getDocumentPromise(`Destination`, id);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Read all Requirements for a Destination
export const getDestinationRequirements = async (
	destinationCountryCode: string,
	destinationLocation: string
): Promise<any> => {
	if (!destinationCountryCode || !destinationLocation) return false;
	try {
		const destination = (await getDocumentPromise(
			`Destination`,
			`${destinationCountryCode}/${destinationLocation}`
		)) as Destination;
		if (!destination) return false;
		return destination.requirements;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Read all Destinations
export const getDestinations = async (): Promise<any> => {
	try {
		const destinations = await getSetPromise('', `Destinations`);
		// Retrieve all Destinattions into an Array of Objects
		return await Promise.all(
			destinations.map(async (destination: string) => await getDestination(destination))
		);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Update a Destination (emergency number)
export const updateDestinationEmergencyNumber = async (
	destinationCountryCode: string,
	destinationLocation: string,
	emergencyNumber: string
): Promise<boolean> => {
	if (!destinationCountryCode || !destinationLocation || !emergencyNumber) return false;
	try {
		await setDocumentPromise(
			`Destination`,
			`${destinationCountryCode}/${destinationLocation}`,
			emergencyNumber,
			'$.emergencyNumber'
		);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Update a Destination (latitude and longitude)
export const updateDestinationLatLong = async (
	destinationCountryCode: string,
	destinationLocation: string,
	latitude: number,
	longitude: number
): Promise<any> => {
	if (!destinationCountryCode || !destinationLocation || !latitude || !longitude) return false;
	try {
		await Promise.all([
			setDocumentPromise(
				`Destination`,
				`${destinationCountryCode}/${destinationLocation}`,
				latitude,
				'$.latitude'
			),
			setDocumentPromise(
				`Destination`,
				`${destinationCountryCode}/${destinationLocation}`,
				longitude,
				'$.longitude'
			)
		]);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Update a Requirement for a Destination
export const updateRequirement = async (
	destinationCountryCode: string,
	destinationLocation: string,
	requirementID: string,
	requirement: string
): Promise<boolean> => {
	if (!destinationCountryCode || !destinationLocation || !requirementID || !requirement)
		return false;
	try {
		const destination = (await getDocumentPromise(
			`Destination`,
			`${destinationCountryCode}/${destinationLocation}`
		)) as Destination;
		if (!destination) return false;
		// Checks to see if the requirement already exists, looping through the requirements
		for (const requirementID in destination.requirements) {
			if (destination.requirements[requirementID] === requirement) return false;
		}
		// Updates the requirement
		await setDocumentPromise(
			`Destination`,
			`${destinationCountryCode}/${destinationLocation}`,
			requirement,
			'$.requirements.' + requirementID
		);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Delete a Destination
export const deleteDestination = async (
	destinationCountryCode: string,
	destinationLocation: string
): Promise<any> => {
	if (!destinationCountryCode || !destinationLocation) return false;
	try {
		await Promise.all([
			deleteDocumentPromise(`Destination`, `${destinationCountryCode}/${destinationLocation}`),
			deleteFromSetPromise(``, `Destinations`, `${destinationCountryCode}/${destinationLocation}`)
		]);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Delete a Requirement for a Destination
export const deleteRequirement = async (
	destinationCountryCode: string,
	destinationLocation: string,
	requirementID: string
): Promise<any> => {
	if (!destinationCountryCode || !destinationLocation || !requirementID) return false;
	try {
		await deleteDocumentPromise(
			`Destination`,
			`${destinationCountryCode}/${destinationLocation}`,
			'$.requirements.' + requirementID
		);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Delete a Requirement for a Destination (using the requirement content)
export const deleteRequirementByContent = async (
	destinationCountryCode: string,
	destinationLocation: string,
	requirement: string
): Promise<any> => {
	if (!destinationCountryCode || !destinationLocation || !requirement) return false;
	try {
		const destination = (await getDocumentPromise(
			`Destination`,
			`${destinationCountryCode}/${destinationLocation}`
		)) as Destination;
		if (!destination) return false;
		// Loops through the requirements
		for (const requirementID in destination.requirements) {
			if (destination.requirements[requirementID] === requirement) {
				await deleteDocumentPromise(
					`Destination`,
					`${destinationCountryCode}/${destinationLocation}`,
					'$.requirements.' + requirementID
				);
				return true;
			}
		}
		return false;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Send Email to Consumer with Specific Destination (current date or future date)
export const sendDestinationUpdateEmail = async (
	destinationCountryCode: string,
	destinationLocation: string,
	subject: string,
	message: string
): Promise<any> => {
	if (!destinationCountryCode || !destinationLocation || !subject || !message) return false;
	try {
		// Get all users
		const users = (await getAllUsers()) as User[];
		// Send email to all users
		await Promise.all(
			users.map(async (user: User) => {
				if (user && user.email) {
					// Found Specific Destination?
					let occurence = false;
					// Retrieve User Journeys
					const journeys = user.journeys;
					// Loop through Journeys Object
					for (const journey in journeys) {
						// Loop through Stops
						for (const stop in journeys[journey].stops) {
							const stopData = journeys[journey].stops[stop] as UserStop;
							// Check if stopData matches the destination and departure is in the future or today
							if (
								stopData.destination == `${destinationCountryCode}/${destinationLocation}` &&
								new Date(stopData.departure) > new Date()
							)
								occurence = true;
						}
					}
					// Send Email if Destination Occurs
					if (occurence) await sendEmail(user.email, subject, message);
				}
			})
		);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};
