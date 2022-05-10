import crypto from 'crypto';
import { ADMIN_KEY } from '$lib/env';

// Generates a Random Token using SHA512 and 256 bytes of randomness
export const generateRandomSHA512 = () =>
	crypto.createHash('sha512').update(crypto.randomBytes(256)).digest('hex');

// Generates a Random 6-digit character
export const generateLoginCode = () => {
	let code = '';
	for (let i = 0; i < 6; i++) code += Math.floor(Math.random() * 10);
	return code;
};

// Retrieves User IP from the x-forwarded-for header from the request
// (if present - which it isn't in development)
// May need subsituted for a non-node implementation
export const getIPFromXForwardedFor = (request: any) =>
	request.headers.get('x-forwarded-for') || '127.0.0.1';

// Functions to Format, Sanitise and Validate User Input (returning false if invalid or input if valid)
/// TEXT
export const isTextValid = (input: string) => {
	const text = input.trim().replace(/[^a-zA-Z0-9_\-\s]/g, '');
	return text.length > 0 ? text : false;
};
//// DESTINATION
export const isDestinationValid = (input: string) => {
	const destination = input.trim().replace(/[^a-zA-Z0-9z\/_\-\s]/g, '');
	return destination.length > 0 ? destination : false;
};
/// EMAIL
export const isEmailValid = (input: string) => {
	const email = input.replace(/[^a-zA-Z0-9_\-.\s@]/g, '').trim();
	return email.length > 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : false;
};

// Get the key sent with the request and check if it is the admin key
export const isAdmin = (request: { headers: { get: (arg0: string) => string } }): boolean =>
	request.headers.get('authorization').replace('Bearer ', '') === ADMIN_KEY;
