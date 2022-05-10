// Import needed modules
import { isAdmin } from '$lib/security';
import {
	createHomeItem,
	readHomeItem,
	readHomeItems,
	updateHomeItem,
	deleteHomeItem
} from '$lib/staff/homeitems';
import {
	ADMIN_NOT_AUTHORISED,
	DATABASE_ERROR,
	ITEM_ALREADY_EXISTS,
	ITEM_NOT_FOUND,
	INVALID_INPUT,
	UNKNOWN_ERROR,
	ITEM_CREATED,
	ITEM_DELETED,
	ITEM_UPDATED
} from '$lib/responses';
import { isTextValid } from '$lib/security';

// GET Request Handler (readHomeItem and readHomeItems)
// @ts-ignore
export const get = async ({ request, url }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the home item index from the URL (if present)
	let homeItem = url.searchParams.get('homeItem');

	// Check to see if the home item index is set
	if (homeItem) {
		// Validate/Sanitise Input
		let homeItemIndex = Number(homeItem);
		if (homeItemIndex == null) return INVALID_INPUT;
		// Read the home item
		const homeItemData = await readHomeItem(homeItemIndex);
		// Check to see if the home item was read
		if (!homeItemData) return ITEM_NOT_FOUND;
		// Return the home item
		return {
			status: 200,
			body: homeItemData
		};
	}
	// Otherwise
	else {
		// Read the home items
		const homeItems = await readHomeItems();
		// Check to see if the home items were read
		if (!homeItems) return DATABASE_ERROR;
		// Return the home items
		return {
			status: 200,
			body: homeItems
		};
	}
};

// POST Request Handler (createHomeItem)
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if body, title and content are set
	if (!body || !body.title || !body.content) return INVALID_INPUT;

	// Validate/Sanitise Input
	let homeItemTitle = isTextValid(body.title);
	let homeItemContent = isTextValid(body.content);
	if (!homeItemTitle || !homeItemContent) return INVALID_INPUT;

	// Check to see if the item already exists
	const homeItems = await readHomeItems();
	if (homeItems.find((item: { title: string | boolean }) => item.title === homeItemTitle))
		return ITEM_ALREADY_EXISTS;

	// Create the home item
	const homeItemCreated = await createHomeItem(homeItemTitle, body.content);

	// Check to see if the home item was created
	if (!homeItemCreated) return DATABASE_ERROR;

	return ITEM_CREATED;
};

// PUT Request Handler (updateHomeItem)
// @ts-ignore
export const put = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if body, item, title and content are set
	if (!body || !body.item || !body.title || !body.content) return INVALID_INPUT;

	// Validate/Sanitise Input
	let homeItemIndex = isNumberValid(body.item);
	let homeItemTitle = isTextValid(body.title);
	let homeItemContent: string[] = [];

	// Loop through body.content and sanitise each item
	for (let i = 0; i < body.content.length; i++) {
		let homeItemContentItem = isTextValid(body.content[i]);
		if (!homeItemContentItem) return INVALID_INPUT;
		homeItemContent.push(homeItemContentItem);
	}

	if (!homeItemIndex || !homeItemTitle || !homeItemContent || homeItemContent.length == 0)
		return INVALID_INPUT;

	// Check to see if the item does not exist
	let homeItemData = await readHomeItem(parseFloat(homeItemIndex));
	if (homeItemData != null) return ITEM_NOT_FOUND;

	// Check to see if the Database is down
	if (!homeItemData) return DATABASE_ERROR;

	// Update the home item
	homeItemData = await updateHomeItem(parseFloat(homeItemIndex), homeItemTitle, homeItemContent);
	// Check to see if the home item was updated
	if (!homeItemData) return DATABASE_ERROR;

	return ITEM_UPDATED;
};

// DELETE Request Handler (deleteHomeItem)
// @ts-ignore
export const del = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if body, item is set
	if (!body || !body.item) return INVALID_INPUT;

	// Validate/Sanitise Input
	let homeItemIndex = isNumberValid(body.item);
	if (!homeItemIndex) return INVALID_INPUT;

	// Check to see if the item does not exist
	const homeItemData = await readHomeItem(parseFloat(homeItemIndex));
	if (!homeItemData) return ITEM_NOT_FOUND;

	// Check to see if the Database is down
	if (!homeItemData) return DATABASE_ERROR;

	// Delete the home item
	const homeItemDeleted = await deleteHomeItem(parseFloat(homeItemIndex));

	// Check to see if the home item was deleted
	if (!homeItemDeleted) return DATABASE_ERROR;

	return ITEM_DELETED;
};
