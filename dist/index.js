"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const server = (0, fastify_1.default)({ logger: true });
server.get('/', async (request, reply) => {
    return reply.status(200).send({ message: 'Hello, Fastify!' });
});
const start = async () => {
    try {
        await server.listen({ port: 3000, host: '0.0.0.0' });
        server.log.info(`Server running on http://localhost:3000`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map