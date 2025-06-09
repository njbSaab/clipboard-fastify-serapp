import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: fastify.config.DATABASE_URL,
      },
    },
  });
  await prisma.$connect();

  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
  });
};

export default fp(prismaPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}