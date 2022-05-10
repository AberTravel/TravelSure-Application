// Import needed modules
import { isAdmin } from '$lib/security';
import {
	createFAQItem,
	readFAQItem,
	readFAQItems,
	updateFAQItem,
	deleteFAQItem
} from '$lib/staff/faqitems';
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

// GET Request Handler (readFAQItem and readFAQItems)
// @ts-ignore
export const get = async ({ request, url }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the faq item index from the URL (if present)
	let faqItem = url.searchParams.get('faqItem');

	// Check to see if the faq item index is set
	if (faqItem) {
		// Validate/Sanitise Input
		let faqItemIndex = Number(faqItem);
		if (!faqItemIndex == null) return INVALID_INPUT;
		// Read the faq item
		const faqItemData = await readFAQItem(faqItemIndex);
		// Check to see if the faq item was read
		if (!faqItemData) return ITEM_NOT_FOUND;
		// Return the faq item
		return {
			status: 200,
			body: faqItemData
		};
	}
	// Otherwise
	else {
		// Read the faq items
		const faqItems = await readFAQItems();
		// Check to see if the faq items were read
		if (!faqItems) return DATABASE_ERROR;
		// Return the faq items
		return {
			status: 200,
			body: faqItems
		};
	}
};

// POST Request Handler (createFAQItem)
// @ts-ignore
export const post = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if body, title and content are set
	if (!body || !body.title || !body.content) return INVALID_INPUT;

	// Validate/Sanitise Input
	let faqItemTitle = isTextValid(body.title);
	let faqItemContent = isTextValid(body.content);
	if (!faqItemTitle || !faqItemContent) return INVALID_INPUT;

	// Check to see if the item already exists
	const faqItems = await readFAQItems();
	if (faqItems.find((item: { title: string | boolean }) => item.title === faqItemTitle))
		return ITEM_ALREADY_EXISTS;

	// Create the faq item
	const faqItemCreated = await createFAQItem(faqItemTitle, body.content);

	// Check to see if the faq item was created
	if (!faqItemCreated) return DATABASE_ERROR;

	return ITEM_CREATED;
};

// PUT Request Handler (updateFAQItem)
// @ts-ignore
export const put = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if body, item, title and content are set
	if (!body || !body.item || !body.title || !body.content) return INVALID_INPUT;

	// Validate/Sanitise Input
	let faqItemIndex = isNumberValid(body.item);
	let faqItemTitle = isTextValid(body.title);
	let faqItemContent: string[] = [];

	// Loop through body.content and sanitise each item
	for (let i = 0; i < body.content.length; i++) {
		let faqItemContentItem = isTextValid(body.content[i]);
		if (!faqItemContentItem) return INVALID_INPUT;
		faqItemContent.push(faqItemContentItem);
	}

	if (!faqItemIndex || !faqItemTitle || !faqItemContent || faqItemContent.length == 0)
		return INVALID_INPUT;

	// Check to see if the item does not exist
	let faqItemData = await readFAQItem(parseFloat(faqItemIndex));
	if (faqItemData != null) return ITEM_NOT_FOUND;

	// Check to see if the Database is down
	if (!faqItemData) return DATABASE_ERROR;

	// Update the faq item
	faqItemData = await updateFAQItem(parseFloat(faqItemIndex), faqItemTitle, faqItemContent);
	// Check to see if the faq item was updated
	if (!faqItemData) return DATABASE_ERROR;

	return ITEM_UPDATED;
};

// DELETE Request Handler (deleteFAQItem)
// @ts-ignore
export const del = async ({ request }): Promise<any> => {
	// Check to see if the user is an admin
	if (!isAdmin(request)) return ADMIN_NOT_AUTHORISED;

	// Get the body from the request
	const body = await request.json();

	// Check to see if body, item is set
	if (!body || !body.item) return INVALID_INPUT;

	// Validate/Sanitise Input
	let faqItemIndex = isNumberValid(body.item);
	if (!faqItemIndex) return INVALID_INPUT;

	// Check to see if the item does not exist
	const faqItemData = await readFAQItem(parseFloat(faqItemIndex));
	if (!faqItemData) return ITEM_NOT_FOUND;

	// Check to see if the Database is down
	if (!faqItemData) return DATABASE_ERROR;

	// Delete the faq item
	const faqItemDeleted = await deleteFAQItem(parseFloat(faqItemIndex));

	// Check to see if the faq item was deleted
	if (!faqItemDeleted) return DATABASE_ERROR;

	return ITEM_DELETED;
};
