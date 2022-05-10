// Import needed modules
import { isAdmin, isTextValid } from '$lib/security';
import {
	createDestination,
	createRequirement,
	getDestination,
	getDestinationRequirements,
	getDestinations,
	updateDestinationEmergencyNumber,
	updateDestinationLatLong,
	updateRequirement,
	deleteDestination,
	deleteRequirement,
	deleteRequirementByContent
} from '$lib/staff/destinations';

import {
	ADMIN_NOT_AUTHORISED,
	DATABASE_ERROR,
	DESTINATION_ALREADY_EXISTS,
	DESTINATION_CREATED,
	DESTINATION_DELETED,
	DESTINATION_EMERGENCY_NUMBER_UPDATED,
	DESTINATION_LAT_LONG_UPDATED,
	DESTINATION_NOT_FOUND,
	INVALID_INPUT,
	REQUIREMENT_CREATED,
	REQUIREMENT_DELETED,
	REQUIREMENT_NOT_FOUND,
	REQUIREMENT_UPDATED
} from '$lib/responses';

// GET Request Handler (getDestination and getDestinations, getDestinationRequirements)
// @ts-ignore
export const get = async ({ request, url }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the destination Country Code and destinationLocation from the URL (if present)
	let destinationCountryCode = url.searchParams.get('destinationCountryCode');
	let destinationLocation = url.searchParams.get('destinationLocation');

	// Get the request type from the URL (if present)
	let requestType = url.searchParams.get('requestType') || 'destination';

	// Check if destinationID is set
	if (destinationCountryCode && destinationLocation) {
		// Validate/Sanitise Input
		destinationCountryCode = isTextValid(destinationCountryCode);
		destinationLocation = isTextValid(destinationLocation);
		if (!destinationCountryCode || !destinationLocation) return INVALID_INPUT;

		// Check if requestType is set
		if (requestType) {
			// Validate/Sanitise Input
			requestType = isTextValid(requestType);
			if (!requestType) return INVALID_INPUT;
			// Check if requestType is Requirements
			if (requestType === 'requirements') {
				// Get the destination requirements
				const destinationRequirements = await getDestinationRequirements(
					destinationCountryCode,
					destinationLocation
				);
				// Check to see if a destination has been found
				if (destinationRequirements.length == 0) return DESTINATION_NOT_FOUND;
				// Check to see if the Database is down
				if (!destinationRequirements) return DATABASE_ERROR;
				return {
					status: 200,
					body: destinationRequirements
				};
			} else return INVALID_INPUT;
		}
		// Otherwise, get the destination
		const destination = await getDestination(`${destinationCountryCode}/${destinationLocation}`);
		// Check to see if Destination exists
		if (destination == null) return DESTINATION_NOT_FOUND;
		// Check to see if the Database is down
		if (!destination) return DATABASE_ERROR;
		return {
			status: 200,
			body: destination
		};
	}
	// Otherwise, get the destinations
	else {
		// Get the destinations
		const destinations = await getDestinations();
		// Check to see if an Airport has been found
		if (destinations.length == 0) return DESTINATION_NOT_FOUND;
		// Check to see if the Database is down
		if (!destinations) return DATABASE_ERROR;
		return {
			status: 200,
			body: destinations
		};
	}
};

// POST Request Handler (createDestination, createRequirement)
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if the body, requestType, destinationCountryCode and destinationLocation are set
	if (!body || !body.requestType || !body.destinationCountryCode || !body.destinationLocation)
		return INVALID_INPUT;

	// Validate/Sanitise Input
	const requestType = isTextValid(body.requestType);
	const destinationCountryCode = isTextValid(body.destinationCountryCode);
	const destinationLocation = isTextValid(body.destinationLocation);
	if (!requestType || !destinationCountryCode || !destinationLocation) return INVALID_INPUT;

	// Check if requestType is requirement
	if (requestType === 'requirement') {
		// Check to see if requirementContent is set
		if (!body.requirementContent) return INVALID_INPUT;
		// Validate/Sanitise Input
		let requirementContent = isTextValid(body.requirementContent);
		if (!requirementContent) return INVALID_INPUT;
		// Check if requirement already exists
		const requirements = await getDestinationRequirements(
			destinationCountryCode,
			destinationLocation
		);
		if (
			requirements.find(
				(requirement: { requirementContent: string | boolean }) =>
					requirement.requirementContent === requirementContent
			)
		)
			return DESTINATION_ALREADY_EXISTS;
		// Create the requirement
		const requirement = await createRequirement(
			destinationCountryCode,
			destinationLocation,
			requirementContent
		);
		// Check to see if the Database is down
		if (!requirement) return DATABASE_ERROR;

		return REQUIREMENT_CREATED;
	}

	// Otherwise requestType is destination
	else {
		// Check to see if destinationCountry, emergencyNumber, latitude and longitude are set
		if (!body.destinationCountry || !body.emergencyNumber || !body.latitude || !body.longitude)
			return INVALID_INPUT;
		// Validate/Sanitise Input
		const destinationCountry = isTextValid(body.destinationCountry);
		const emergencyNumber = isTextValid(body.emergencyNumber);
		const latitude = Number(body.latitude);
		const longitude = Number(body.longitude);
		if (!destinationCountry || !emergencyNumber || latitude == null || longitude == null)
			return INVALID_INPUT;
		// Check if destination already exists
		let destination = await getDestination(`${destinationCountryCode}/${destinationLocation}`);
		// Check to see if a destination has been found
		if (destination != null) return DESTINATION_ALREADY_EXISTS;
		// Create the destination
		destination = await createDestination(
			destinationCountryCode,
			destinationLocation,
			destinationCountry,
			emergencyNumber,
			latitude,
			longitude
		);
		// Check to see if a destination has been
		if (!destination) return DATABASE_ERROR;
		return DESTINATION_CREATED;
	}
};

// PUT Request Handler (updateDestinationEmergencyNumber, updateDestinationLatLong, updateRequirement)
// @ts-ignore
export const put = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if the body, requestType, destinationCountryCode and destinationLocation are set
	if (!body || !body.requestType || !body.destinationCountryCode || !body.destinationLocation)
		return INVALID_INPUT;

	// Validate/Sanitise Input
	const requestType = isTextValid(body.requestType);
	const destinationCountryCode = isTextValid(body.destinationCountryCode);
	const destinationLocation = isTextValid(body.destinationLocation);
	if (!requestType || !destinationCountryCode || !destinationLocation) return INVALID_INPUT;

	// Switch on requestType
	switch (requestType) {
		// Update the emergency number
		case 'emergencyNumber':
			// Check to see if emergencyNumber is set
			if (!body.emergencyNumber) return INVALID_INPUT;
			// Validate/Sanitise Input
			const emergencyNumber = isTextValid(body.emergencyNumber);
			if (!emergencyNumber) return INVALID_INPUT;
			// Update the emergency number
			let destinationEmergency = await updateDestinationEmergencyNumber(
				destinationCountryCode,
				destinationLocation,
				emergencyNumber
			);
			// Check to see if a destination has been found
			if (destinationEmergency == null) return DESTINATION_NOT_FOUND;
			// Check to see if the Database is down
			if (!destinationEmergency) return DATABASE_ERROR;
			return DESTINATION_EMERGENCY_NUMBER_UPDATED;
		// Update the latitude and longitude
		case 'latLong':
			// Check to see if latitude and longitude are set
			if (!body.latitude || !body.longitude) return INVALID_INPUT;
			// Validate/Sanitise Input
			const latitude = isNumberValid(body.latitude);
			const longitude = isNumberValid(body.longitude);
			if (!latitude || !longitude) return INVALID_INPUT;
			// Update the latitude and longitude
			let destinationLatLong = await updateDestinationLatLong(
				destinationCountryCode,
				destinationLocation,
				parseFloat(latitude),
				parseFloat(longitude)
			);
			// Check to see if a destination has been found
			if (destinationLatLong == null) return DESTINATION_NOT_FOUND;
			// Check to see if the Database is down
			if (!destinationLatLong) return DATABASE_ERROR;
			return DESTINATION_LAT_LONG_UPDATED;
		// Update the requirement
		case 'requirement':
			// Check to see if requirementID and requirementContent are set
			if (!body.requirementID || !body.requirementContent) return INVALID_INPUT;
			// Validate/Sanitise Input
			const requirementID = isNumberValid(body.requirementID);
			const requirementContent = isTextValid(body.requirementContent);
			if (!requirementID || !requirementContent) return INVALID_INPUT;
			// Update the requirement
			let requirement = await updateRequirement(
				destinationCountryCode,
				destinationLocation,
				requirementID,
				requirementContent
			);
			// Check to see if a requirement has been found
			if (requirement == null) return REQUIREMENT_NOT_FOUND;
			// Check to see if the Database is down
			if (!requirement) return DATABASE_ERROR;
			return REQUIREMENT_UPDATED;
		// Otherwise requestType is destination
		default:
			return INVALID_INPUT;
	}
};

// DELETE Request Handler (deleteDestination, deleteRequirement, deleteRequirementByContent)
// @ts-ignore
export const del = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if the body, requestType, destinationCountryCode and destinationLocation are set
	if (!body || !body.requestType || !body.destinationCountryCode || !body.destinationLocation)
		return INVALID_INPUT;

	// Validate/Sanitise Input
	const requestType = isTextValid(body.requestType);
	const destinationCountryCode = isTextValid(body.destinationCountryCode);
	const destinationLocation = isTextValid(body.destinationLocation);
	if (!requestType || !destinationCountryCode || !destinationLocation) return INVALID_INPUT;

	// Switch on requestType
	switch (requestType) {
		// Delete the destination
		case 'destination':
			// Delete the destination
			let destination = await deleteDestination(destinationCountryCode, destinationLocation);
			// Check to see if a destination has been found
			if (destination == null) return DESTINATION_NOT_FOUND;
			// Check to see if the Database is down
			if (!destination) return DATABASE_ERROR;
			return DESTINATION_DELETED;
		// Delete the Requirement
		case 'requirement':
			// Check to see if requirementID is set
			if (!body.requirementID) return INVALID_INPUT;
			// Validate/Sanitise Input
			const requirementID = isNumberValid(body.requirementID);
			if (!requirementID) return INVALID_INPUT;
			// Delete the Requirement
			let requirement = await deleteRequirement(
				destinationCountryCode,
				destinationLocation,
				requirementID
			);
			// Check to see if a requirement has been found
			if (requirement == null) return REQUIREMENT_NOT_FOUND;
			// Check to see if the Database is down
			if (!requirement) return DATABASE_ERROR;
			return REQUIREMENT_DELETED;
		// Delete the Requirement by Content
		case 'requirementByContent':
			// Check to see if requirementContent is set
			if (!body.requirementContent) return INVALID_INPUT;
			// Validate/Sanitise Input
			const requirementContent = isTextValid(body.requirementContent);
			if (!requirementContent) return INVALID_INPUT;
			// Delete the Requirement
			let requirementByContent = await deleteRequirementByContent(
				destinationCountryCode,
				destinationLocation,
				requirementContent
			);
			// Check to see if a requirement has been found
			if (requirementByContent == null) return REQUIREMENT_NOT_FOUND;
			// Check to see if the Database is down
			if (!requirementByContent) return DATABASE_ERROR;
			return REQUIREMENT_DELETED;
		// Otherwise requestType is invalid
		default:
			return INVALID_INPUT;
	}
};
