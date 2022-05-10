// Import needed modules
import {
	getDocumentPromise,
	setDocumentPromise,
	appendDocumentPromise
} from '$lib/database/operations/documents';
import type { FeedItem } from '$lib/types';

// Create Home Item
export const createHomeItem = async (title: string, content: string[]): Promise<any> => {
	if (!title || !content) return false;
	try {
		// Append the Home Item to the FAQ Items
		await appendDocumentPromise('', 'HomeItems', { title, content });
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Read Home Item
export const readHomeItem = async (item: number): Promise<any> => {
	try {
		// Retrieve HomeItems
		const HomeItems = (await getDocumentPromise('', 'HomeItems')) as { [key: string]: FeedItem };
		// Return HomeItem
		return HomeItems[item];
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Read Home Items
export const readHomeItems = async (): Promise<any> => {
	try {
		// Return HomeItems
		return (await getDocumentPromise('', 'HomeItems')) as { [key: string]: FeedItem };
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Update Home Item
export const updateHomeItem = async (
	item: number,
	title: string,
	content: string[]
): Promise<any> => {
	if (!title || !content) return false;
	try {
		// Retrieve HomeItems
		const HomeItems = (await getDocumentPromise('', 'HomeItems')) as { [key: string]: FeedItem };
		// Update HomeItem
		HomeItems[item] = {
			title: title,
			content: content
		};
		// Update HomeItems
		await setDocumentPromise('', 'HomeItems', HomeItems);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Delete Home Item
export const deleteHomeItem = async (item: number): Promise<any> => {
	try {
		// Retrieve HomeItems
		const HomeItems = (await getDocumentPromise('', 'HomeItems')) as { [key: string]: FeedItem };
		// Delete HomeItem
		delete HomeItems[item];
		// Update HomeItems
		await setDocumentPromise('', 'HomeItems', HomeItems);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};
