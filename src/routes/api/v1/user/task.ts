// Import needed modules

import { INVALID_INPUT } from '$lib/responses';
import { isTextValid } from '$lib/security';
import { createTask, deleteTask } from '$lib/user/tasks';
import { parse } from 'cookie';

// DEL Request Handler
// @ts-ignore
export const del = async ({ request }): Promise<any> => {
	// Get the body from the request
	const body = await request.json();
	// Check to see if body and taskName and value are set
	if (!body || !body.taskName) return INVALID_INPUT;
	// Validate/Sanitise Input
	let checklist = Number(body.checklistID);
	let taskName = isTextValid(body.taskName);
	if (checklist == null || !taskName) return INVALID_INPUT;
	// Retrieve Token from Cookie
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';
	// Delete the User's Task
	return await deleteTask(sessionToken, checklist, taskName);
};

// POST Request Handler
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	// Get the body from the request
	const body = await request.json();
	// Check to see if body and taskName and value are set
	if (!body || !body.taskName) return INVALID_INPUT;
	// Validate/Sanitise Input
	let checklist = Number(body.checklistID);
	let taskName = isTextValid(body.taskName);
	if (checklist == null || !taskName) return INVALID_INPUT;
	// Retrieve Token from Cookie
	const sessionToken = parse(request.headers.get('cookie') || '').sessionToken ?? '';
	// Create the User's Task
	return await createTask(sessionToken, checklist, taskName);
};
