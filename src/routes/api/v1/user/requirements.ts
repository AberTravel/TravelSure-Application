// Imports needed modules
import { INVALID_INPUT } from '$lib/responses';
import { isDestinationValid, isTextValid } from '$lib/security';
import { getRequirementChecklist, updateRequirementChecklist } from '$lib/user/requirements';
import { parse } from 'cookie';

// GET Request Handler
// @ts-ignore
export const get = async ({ request }): Promise<any> => {
	// Retrieve Token from Cookie
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';
	// Retrieve User Feed
	return await getRequirementChecklist(sessionToken);
};

// PUT Request Handler
// @ts-ignore
export const put = async ({ request }): Promise<any> => {
	// Get the body from the request
	const body = await request.json();
	// Check to see if body, destination, requirement and value are set
	if (!body || !body.destination || !body.requirement) return INVALID_INPUT;
	// Validate/Sanitise Input
	let destination = isDestinationValid(body.destination);
	let requirement = isTextValid(body.requirement);
	let value = Boolean(body.value);
	if (!destination || !requirement) return INVALID_INPUT;
	// Retrieve Token from Cookie
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';
	// Update the User's Requirement Checklist
	return updateRequirementChecklist(sessionToken, destination, requirement, value);
};
