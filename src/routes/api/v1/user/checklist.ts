// Imports needed modules
import { INVALID_INPUT } from '$lib/responses';
import { isTextValid } from '$lib/security';
import {
	createChecklist,
	deleteChecklist,
	getChecklist,
	updateChecklist
} from '$lib/user/checklists';
import { parse } from 'cookie';

// GET Request Handler
// @ts-ignore
export const get = async ({ request, url }): Promise<any> => {
	/// Get the checklist index from the URL (if present)
	let checklist = url.searchParams.get('checklist');
	// Check to see if checklist is valid
	if (!checklist) return INVALID_INPUT;
	// Validate/Sanitise Input
	checklist = Number(checklist);
	// Check to see if checklist is valid
	if (checklist == null) return INVALID_INPUT;
	// Retrieve Token from Cookie
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';
	// Retrieve User Feed
	return await getChecklist(sessionToken, checklist);
};

// PUT Request Handler
// @ts-ignore
export const put = async ({ request }): Promise<any> => {
	// Get the body from the request
	const body = await request.json();
	// Check to see if body, checklist, taskName and value are set
	if (!body || !body.taskName) return INVALID_INPUT;
	// Validate/Sanitise Input
	let checklist = Number(body.checklist);
	let taskName = body.taskName;
	let value = Boolean(body.value);
	if (checklist == null || !taskName) return INVALID_INPUT;
	// Retrieve Token from Cookie
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';
	// Update the User's Requirement Checklist
	return updateChecklist(sessionToken, checklist, taskName, value);
};

// DEL Request Handler
// @ts-ignore
export const del = async ({ request }): Promise<any> => {
	// Get the body from the request
	const body = await request.json();
	// Check to see if body and checklistID and value are set
	if (!body || !body.checklistID) return INVALID_INPUT;
	// Validate/Sanitise Input
	let checklist = Number(body.checklistID);
	if (checklist == null) return INVALID_INPUT;
	// Retrieve Token from Cookie
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';
	// Delete the User's Checklist
	return await deleteChecklist(sessionToken, checklist);
};

// POST Request Handler
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	// Get the body from the request
	const body = await request.json();
	// Check to see if body and name and value are set
	if (!body || !body.name) return INVALID_INPUT;
	// Validate/Sanitise Input
	let name = isTextValid(body.name);
	if (!name) return INVALID_INPUT;
	// Retrieve Token from Cookie
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';
	// Create the User's Checklist
	return await createChecklist(sessionToken, name);
};
