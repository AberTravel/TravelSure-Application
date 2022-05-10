import { handler } from './build/handler.js';
import fastify from 'fastify';
import middiePlugin from 'middie';
import fs from 'fs';

('use strict');

const fastifyServer = fastify({
	logger: true,
	http2: true,
	https: {
		allowHTTP1: true,
		key: fs.readFileSync('/certificates/privkey1.pem'),
		cert: fs.readFileSync('/certificates/cert1.pem')
	}
});

await fastifyServer.register(middiePlugin);
fastifyServer.use(handler);

// Start Fastify server
const start = async () => {
	try {
		await fastifyServer.listen(3000, '0.0.0.0');
		fastifyServer.log.info(`server listening on ${fastifyServer.server.address().port}`);
	} catch (err) {
		fastifyServer.log.error(err);
		process.exit(1);
	}
};
start();
