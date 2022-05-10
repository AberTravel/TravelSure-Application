// Imports needed modules
import client from '$lib/database/client';

// Aschronously Gets a Document or Document Path
export const getDocumentPromise = async (
	index: string,
	key: string,
	path = '$'
): Promise<Object> => {
	if (!index && !key) return JSON.parse('{}');
	if (index.length == 0) return await client.json.GET(key, path);
	else return await client.json.GET(`${index}:${key}`, path);
};

// Asynchronously Deletes a Document or Document Path
export const deleteDocumentPromise = async (
	index: string,
	key: string,
	path = '$'
): Promise<void> => {
	if (!index && !key) return;
	if (index.length == 0) return await client.json.DEL(key, path);
	else return await client.json.DEL(`${index}:${key}`, path);
};

// Asynchronously Sets a Document or Document Path
export const setDocumentPromise = async (
	index: string,
	key: string,
	value: any,
	path = '$'
): Promise<void> => {
	if (!index && !key && !value) return;
	if (index.length == 0) await client.json.SET(key, path, value);
	else await client.json.SET(`${index}:${key}`, path, value);
};

// Asynchronously Sets an expiring Document or Document Path
export const setExpiringDocumentPromise = async (
	index: string,
	key: string,
	value: any,
	seconds: number,
	path = '$'
): Promise<void> => {
	if (!index && !key && !value) return;
	if (index.length == 0) await client.json.SET(`${key}`, path, value);
	else await client.json.SET(`${index}:${key}`, path, value);
	// Don't wait for the expiration to be set
	client.EXPIRE(`${index}:${key}`, seconds);
};

// Asynchronously Appends a value to an Array in a Document or Document Path
export const appendDocumentPromise = async (
	index: string,
	key: string,
	value: any,
	path = '$'
): Promise<void> => {
	if (!index && !key && !value) return;
	if (index.length == 0) await client.json.APPEND(key, path, value);
	else await client.json.APPEND(`${index}:${key}`, path, value);
};
