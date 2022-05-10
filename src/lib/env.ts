// Import needed modules
import dotenv from 'dotenv';

// Enable access to the .env file
dotenv.config();

// Redis Client Settings
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

// Mailer Settings
export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const MAIL_SECURE = process.env.MAIL_SECURE;
export const MAIL_USERNAME = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

// OpenWeatherMap Settings
export const WEATHER_API = process.env.WEATHER_API;
export const WEATHER_KEY = process.env.WEATHER_KEY;
export const WEATHER_CACHE_TIME = process.env.WEATHER_CACHE_TIME;

// Google Map Settings
export const GOOGLE_MAPS_API = process.env.GOOGLE_MAPS_API;
export const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY;
export const GOOGLE_MAPS_SEARCH_RADIUS = process.env.GOOGLE_MAPS_SEARCH_RADIUS;
export const GOOGLE_CACHE_TIME = process.env.GOOGLE_CACHE_TIME;

// TravelSure Settings
export const ADMIN_KEY = process.env.ADMIN_KEY;

/// Security Settings
export const ENABLE_IP_CHECK = process.env.ENABLE_IP_CHECK;
export const IP_TRUST_TIME = process.env.IP_TRUST_TIME;
export const IP_CODE_VALID_TIME = process.env.IP_CODE_VALID_TIME;
export const IP_CODE_REMINDER_TIME = process.env.IP_CODE_REMINDER_TIME;
export const SESSION_LIFETIME = process.env.SESSION_LIFETIME;
