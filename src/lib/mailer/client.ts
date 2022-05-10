// Imports needed modules
// @ts-ignore
import nodemailer from 'nodemailer';
import { MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USERNAME, MAIL_PASSWORD } from '$lib/env';

// Creates a new Nodemailer client global variable
// @ts-ignore
let client = global.nodemailerClient;

// Checks if the client exists
if (!client) {
	// Creates a new Nodemailer client instance
	// @ts-ignore
	client = global.redisCluster = nodemailer.createTransport({
		host: MAIL_HOST,
		port: MAIL_PORT,
		secure: MAIL_SECURE,
		auth: {
			user: MAIL_USERNAME,
			pass: MAIL_PASSWORD
		}
	});
}

export default client;
