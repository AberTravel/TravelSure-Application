// Import needed modules
import {
	getDocumentPromise,
	deleteDocumentPromise,
	setDocumentPromise,
	setExpiringDocumentPromise
} from '$lib/database/operations/documents';
import {
	getKeyPromise,
	setExpiringKeyPromise,
	deleteKeyPromise
} from '$lib/database/operations/strings';
import { INVALID_ACCOUNT, INVALID_INPUT, REQUESTED_IP_CODE } from '$lib/responses';
import type { Session, User } from '$lib/types';
import {
	ENABLE_IP_CHECK,
	IP_CODE_REMINDER_TIME,
	IP_CODE_VALID_TIME,
	IP_TRUST_TIME,
	SESSION_LIFETIME
} from '$lib/env';
import { generateLoginCode, generateRandomSHA512 } from '$lib/security';
import { sendEmail } from '$lib/mailer/operations/sendEmail';
import { serialize } from 'cookie';
import client from '$lib/database/client';

// Checks if a user has login locoation verified
export const isUserLocationVerified = async (
	user: User,
	ip: string,
	requestCode: boolean = true
): Promise<any> => {
	if (!user || !ip) return INVALID_INPUT;
	try {
		// Replace dots with dashes in ip
		const ipReplaced = ip.replace(/\./g, '-');
		// Retrieve location
		const location = user.knownLogins[ipReplaced];
		// Check if location exists and is still valid
		if (location != null && new Date(location) > new Date()) return true;
		// Delete location
		await deleteDocumentPromise('User', user.email, `knownLogins.${ipReplaced}`);
		// Check if request code is enabled, requesting a login code if it is
		if (requestCode) await requestLoginCode(user.email);
		return false;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Checks the access code and verifies the date is still valid
export const isJourneyStillValid = async (user: User, accessCode: string): Promise<any> => {
	if (!user || !accessCode) return INVALID_INPUT;
	try {
		// Get journey
		const journey = user.journeys[accessCode];
		// Check if journey exists
		if (!journey) return null;
		// Check if journey is still valid
		if (new Date(journey.expiresOn) > new Date()) return true;
		// Journey is not valid anymore, delete it
		await deleteDocumentPromise(`User`, user.email, `$.journeys.${accessCode}`);
		return false;
	} catch (error) {
		console.log(error);
		return null;
	}
};

//  Generates a Login Code, if not already exists and sends it to the user
const requestLoginCode = async (email: string) => {
	if (!email) return INVALID_INPUT;
	try {
		// Retrieve Code
		let code = await getKeyPromise(`Code`, email);
		// Check if code exists, if it does then call shouldSendReminderEmail
		if (code != null) return shouldSendReminderEmail(email);
		// Generate code
		code = generateLoginCode();
		// Wait on the setting of the code and last email tracker, while also sending the email.
		await Promise.all([
			setExpiringKeyPromise(`Code`, email, code, parseFloat(IP_CODE_VALID_TIME ?? '900')),
			setExpiringKeyPromise(`LastEmail`, email, code, parseFloat(IP_CODE_REMINDER_TIME ?? '300')),
			sendEmail(email, `TravelSure Login Code`, `Your login code is ${code}`)
		]);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Checks if a user should receive a reminder email
const shouldSendReminderEmail = async (email: string) => {
	if (!email) return INVALID_INPUT;
	try {
		// Retrieves the Code and Last Email
		let [lastEmail, code] = await Promise.all([
			getKeyPromise(`LastEmail`, email),
			getKeyPromise(`Code`, email)
		]);
		// Checks if the last email exists
		if (lastEmail != null) return false;
		// Sends a reminder email and updates the last email
		await Promise.all([
			sendEmail(email, `TravelSure Login Code Reminder`, `Your login code is ${code}`),
			setExpiringKeyPromise(`LastEmail`, email, code, parseFloat(IP_CODE_REMINDER_TIME ?? '300'))
		]);
		return true;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Deletes the session from the database and returns an un-authenticated response
const endSessionAndReturn = async (sessionToken: string) => {
	if (!sessionToken) return INVALID_INPUT;
	try {
		// Delete Session
		deleteDocumentPromise('Session', sessionToken);
		// Non-Authorised Response
		return { authenticated: false };
	} catch {
		return { authenticated: false };
	}
};

// Login Function used to Authenticate the user
export const login = async (email: string, accessCode: string, ip: string): Promise<any> => {
	if (!email || !accessCode || !ip) return INVALID_INPUT;
	try {
		// Get the User Document
		let userDocument = (await getDocumentPromise('User', email)) as User;
		// Check if the user exists
		if (!userDocument) return INVALID_ACCOUNT;
		// Check if the access code is valid
		if (!(await isJourneyStillValid(userDocument, accessCode))) return INVALID_ACCOUNT;
		// Check if IP Location is Valid - If IP Check is enabled
		if (Boolean(ENABLE_IP_CHECK) && !(await isUserLocationVerified(userDocument, ip)))
			return REQUESTED_IP_CODE;
		// Generate Session Token
		const sessionToken = generateRandomSHA512();
		// Get cookie lifespan
		const cookieLifespan = parseFloat(SESSION_LIFETIME ?? '86400');
		// Store Session Token
		await setExpiringDocumentPromise(
			`Session`,
			sessionToken,
			{ email, accessCode },
			cookieLifespan
		);
		// Return Session Token as Cookie
		return {
			status: 200,
			headers: {
				'Set-Cookie': serialize('sessionToken', sessionToken, {
					httpOnly: true,
					maxAge: cookieLifespan,
					sameSite: 'strict',
					secure: true,
					path: '/'
				})
			},
			body: {
				message: 'Login successful'
			}
		};
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Verify Function used to Authenticate the user's location and log in the user
export const verify = async (
	email: string,
	accessCode: string,
	ip: string,
	ipCode: string
): Promise<any> => {
	if (!email || !accessCode || !ip || !ipCode) return INVALID_INPUT;
	try {
		// Retrieve Code
		let code = await getKeyPromise(`Code`, email);
		// Check if the code is valid
		if (code != ipCode) return INVALID_INPUT;
		// Delete code and last email while also updating the known logins
		await Promise.all([
			deleteKeyPromise('Code', email),
			deleteKeyPromise('LastEmail', email),
			setDocumentPromise(
				`User`,
				email,
				new Date(new Date().getTime() + parseFloat(IP_TRUST_TIME ?? '86400') * 1000).toISOString(),
				`knownLogins.${ip.replace(/\./g, '-')}`
			)
		]);
		// Attempt to login the user
		return await login(email, accessCode, ip);
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Validate Session Function used to confirm the user is logged in
export const validateSession = async (sessionToken: string, ip: string): Promise<any> => {
	if (!sessionToken || !ip) return INVALID_INPUT;
	try {
		// Retrieve Session
		const session = (await getDocumentPromise(`Session`, sessionToken)) as Session;
		// Check if session exists
		if (!session) return endSessionAndReturn(sessionToken);

		// Retrieve Email and Access Code
		const { email, accessCode } = session;

		// Retrieve User
		const user = (await getDocumentPromise(`User`, email)) as User;
		// Check if user exists
		if (!user) return endSessionAndReturn(sessionToken);

		// Check if the access code is valid
		if (!(await isJourneyStillValid(user, accessCode))) return endSessionAndReturn(sessionToken);

		// Check if IP Location is Valid - If IP Check is enabled
		if (Boolean(ENABLE_IP_CHECK) && !(await isUserLocationVerified(user, ip)))
			return endSessionAndReturn(sessionToken);

		// Return Session Details and Authenticated Response
		return {
			authenticated: true,
			email,
			accessCode
		};
	} catch (error) {
		console.log(error);
		return { authenticated: false };
	}
};

// Logout Function used to Destroy the user's session
export const logout = async (sessionToken: string): Promise<any> =>
	endSessionAndReturn(sessionToken);
