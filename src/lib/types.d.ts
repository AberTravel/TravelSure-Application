/// Definition for Airport Data
export type Airport = {
	id: string;
	name: string;
};

// Defintion for Session Data
export type Session = {
	email: string;
	accessCode: string;
};

// Definition for User Data
export type User = {
	email: string;
	journeys: { [key: string]: UserJourney } = {};
	knownLogins: { [key: string]: string } = {};
};

/// Definition for User Journey Data
export type UserJourney = {
	stops: UserStop[] = [];
	expiresOn: string;
	checklists: UserChecklist[] = [];
	requirements: {
		[key: string]: {
			[key: string]: {
				name: string;
				value: boolean;
			};
		};
	} = {};
};

/// Definition for User Stop Data
export type UserStop = {
	startAirport: string;
	destinationAirport: string;
	destination: string;
	arrival: string;
	departure: string;
};

/// Definition for User Stop Data
export type UserData = {
	startAirport: string;
	destinationAirport: string;
	destination: string;
	arrival: string;
	departure: string;
};

// Definition for User Checklist Data
export type UserChecklist = {
	name: string;
	items: { [key: string]: boolean } = {};
};

// Definition for Destination Data
export type Destination = {
	country: string;
	location: string;
	countryCode: string;
	destinationInfo: DestinationInfo;
	emergencyNumber: string;
	latitude: number;
	longitude: number;
	requirements: { [key: string]: string };
};

// Defintion for Destination Info Data
export type DestinationInfo = {
	weather: DestinationWeather;
	car_rental: DestinationLocation;
	tourist_attraction: DestinationLocation;
	restaurant: DestinationLocation;
};

// Defintion for Destination Weather Data
export type DestinationWeather = {
	nextUpdate: string;
	weather: string;
	weatherDescription: string;
	currentTemp: string;
	lowestTemp: string;
	highestTemp: string;
	wind: string;
};

// Definition for Destination Location Data
export type DestinationLocation = {
	nextUpdate: string;
	results: Array<DestinationLocationResults>;
};

// Defintion for Destination Location Results Data
export type DestinationLocationResults = {
	name: string;
	address: string;
	rating: number;
	totalReviews: number;
};

// Defination for Feed Item Data
export type FeedItem = {
	title: string;
	content: string[];
};
