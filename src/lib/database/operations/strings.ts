// Imports needed modules
import client from '$lib/database/client';

// Asynchronously Gets a string key
export const getKeyPromise = async (index: string, key: string): Promise<string> => {
	if (!index && !key) return '';
	if (index.length == 0) return await client.GET(key);
	else return await client.GET(`${index}:${key}`);
};

// Asynchronously Deletes a string key
export const deleteKeyPromise = async (index: string, key: string): Promise<void> => {
	if (!index && !key) return;
	if (index.length == 0) return client.DEL(key);
	else return client.DEL(`${index}:${key}`);
};

// Asynchronously Sets a string key
export const setKeyPromise = async (index: string, key: string, value: string): Promise<void> => {
	if (!index && !key && !value) return;
	if (index.length == 0) await client.SET(key, value);
	else await client.SET(`${index}:${key}`, value);
};

// Asynchronously Sets an expiring string key
export const setExpiringKeyPromise = async (
	index: string,
	key: string,
	value: string,
	seconds: number
): Promise<void> => {
	if (!index && !key && !value) return;
	if (index.length == 0) await client.SETEX(key, seconds, value);
	else await client.SETEX(`${index}:${key}`, seconds, value);
};
