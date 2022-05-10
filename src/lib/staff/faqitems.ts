// Import needed modules
import {
	getDocumentPromise,
	setDocumentPromise,
	appendDocumentPromise
} from '$lib/database/operations/documents';
import type { FeedItem } from '$lib/types';

// Create FAQ Item
export const createFAQItem = async (title: string, content: string[]): Promise<any> => {
	if (!title || !content) return false;
	try {
		// Append the FAQ Item to the FAQ Items
		await appendDocumentPromise('', 'FAQItems', { title, content });
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Read FAQ Item
export const readFAQItem = async (item: number): Promise<any> => {
	try {
		// Retrieve FAQItems
		const FAQItems = (await getDocumentPromise('', 'FAQItems')) as { [key: string]: FeedItem };
		// Return FAQItem
		return FAQItems[item];
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Read FAQ Items
export const readFAQItems = async (): Promise<any> => {
	try {
		// Return FAQItems
		return (await getDocumentPromise('', 'FAQItems')) as { [key: string]: FeedItem };
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Update FAQ Item
export const updateFAQItem = async (
	item: number,
	title: string,
	content: string[]
): Promise<any> => {
	if (!title || !content) return false;
	try {
		// Retrieve FAQItems
		const FAQItems = (await getDocumentPromise('', 'FAQItems')) as { [key: string]: FeedItem };
		// Update FAQItem
		FAQItems[item] = {
			title: title,
			content: content
		};
		// Update FAQItems
		await setDocumentPromise('', 'FAQItems', FAQItems);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Delete FAQ Item
export const deleteFAQItem = async (item: number): Promise<any> => {
	try {
		// Retrieve FAQItems
		const FAQItems = (await getDocumentPromise('', 'FAQItems')) as { [key: string]: FeedItem };
		// Delete FAQItem
		delete FAQItems[item];
		// Update FAQItems
		await setDocumentPromise('', 'FAQItems', FAQItems);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};
