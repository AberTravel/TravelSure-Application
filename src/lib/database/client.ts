// Imports needed modules
import { createCluster } from 'redis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '$lib/env';

// Creates a new Redis cluster global variable
// @ts-ignore
let client = global.redisCluster;

// Checks if the client exists
if (!client) {
	// Creates a new Redis cluster instance
	// @ts-ignore
	client = global.redisCluster = createCluster({
		rootNodes: [{ url: `redis://${REDIS_HOST}:${REDIS_PORT}` }],
		defaults: { password: REDIS_PASSWORD },
		useReplicas: true
	});

	// Connects to the Redis CLuster
	await client.connect();
}

export default client;
