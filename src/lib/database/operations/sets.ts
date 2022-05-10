// Imports needed modules
import client from '$lib/database/client';

// Asynchronously Delete a string from a Set
export const deleteFromSetPromise = async (
	index: string,
	key: string,
	value: string
): Promise<void> => {
	if (!index && !key && !value) return;
	if (index.length == 0) await client.SREM(key, value);
	else await client.SREM(`${index}:${key}`, value);
};

// Asynchronously Add a string to a Set
export const addToSetPromise = async (index: string, key: string, value: string): Promise<void> => {
	if (!index && !key && !value) return;
	if (index.length == 0) await client.SADD(key, value);
	else await client.SADD(`${index}:${key}`, value);
};

// Asynchronously Get a Set
export const getSetPromise = async (index: string, key: string): Promise<string[]> => {
	if (!index && !key) return [];
	if (index.length == 0) return await client.SMEMBERS(key);
	else return await client.SMEMBERS(`${index}:${key}`);
};

// Asynchronously Check if a string is in a Set
export const isInSetPromise = async (
	index: string,
	key: string,
	value: string
): Promise<boolean> => {
	if (!index && !key && !value) return false;
	if (index.length == 0) return await client.SISMEMBER(key, value);
	else return await client.SISMEMBER(`${index}:${key}`, value);
};
