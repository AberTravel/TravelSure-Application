// Imports needed modules
import client from '$lib/mailer/client';

// Asynchronously Sends an email to an external address
export const sendEmail = async (to: string, subject: string, body: string): Promise<boolean> => {
	try {
		await client.sendMail({
			from: '"TravelSure" <travelsure@aber.travel>',
			to: to,
			subject: subject,
			text: body
		});
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

// Asynchronously Sends an email to the TravelSure Support Team
export const sendSupportEmail = async (
	name: string,
	email: string,
	body: string
): Promise<boolean> => {
	try {
		await client.sendMail({
			from: `"${name}" <travelsure-contactus@aber.travel>`,
			to: `travelsure-support@aber.travel`,
			subject: `${name} - ${email} / has sent you a message`,
			text: `${body}`
		});
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};
