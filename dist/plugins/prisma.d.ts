import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
declare const _default: FastifyPluginAsync;
export default _default;
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}
