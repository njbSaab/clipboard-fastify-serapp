import { FastifyPluginAsync, FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ClipboardEntry, Prisma } from '@prisma/client';
import { createClipboardSchema, toggleFavoriteSchema, deleteClipboardSchema } from '../schemas/clopboard';

interface CreateClipboardRequest {
  Body: { content: string };
}

interface ToggleFavoriteRequest {
  Params: { id: string };
  Body: { favorite: boolean };
}

interface DeleteClipboardRequest {
  Params: { id: string };
}

const clipboardRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // POST /clipboard — создать запись
  fastify.post<{ Body: { content: string } }>('/', { schema: createClipboardSchema }, async (request: FastifyRequest<CreateClipboardRequest>, reply: FastifyReply) => {
    const { content } = request.body;
    const item: ClipboardEntry = await fastify.prisma.clipboardEntry.create({
      data: { content },
    });
    return reply.status(201).send(item);
  });

  // GET /clipboard — получить все записи
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const items: ClipboardEntry[] = await fastify.prisma.clipboardEntry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return reply.send(items);
  });

  // PATCH /clipboard/:id/favorite — переключить статус избранного
  fastify.patch<{ Params: { id: string }; Body: { favorite: boolean } }>('/:id/favorite', { schema: toggleFavoriteSchema }, async (request: FastifyRequest<ToggleFavoriteRequest>, reply: FastifyReply) => {
    const { id } = request.params;
    const { favorite } = request.body;
    try {
      const item: ClipboardEntry = await fastify.prisma.clipboardEntry.update({
        where: { id },
        data: { favorite },
      });
      return reply.send(item);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return reply.status(404).send({ error: 'Clipboard entry not found' });
      }
      throw error;
    }
  });

  // GET /clipboard/frequent — получить часто используемые записи
  fastify.get('/frequent', async (request: FastifyRequest, reply: FastifyReply) => {
    const items: ClipboardEntry[] = await fastify.prisma.clipboardEntry.findMany({
      orderBy: { usageCount: 'desc' },
      take: 10,
    });
    return reply.send(items);
  });

  // POST /clipboard/:id/increment — инкремент usageCount
  fastify.post<{ Params: { id: string } }>('/:id/increment', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    try {
      const item: ClipboardEntry = await fastify.prisma.clipboardEntry.update({
        where: { id },
        data: { usageCount: { increment: 1 } },
      });
      return reply.send(item);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return reply.status(404).send({ error: 'Clipboard entry not found' });
      }
      throw error;
    }
  });

  // DELETE /clipboard/:id — удалить запись
  fastify.delete<{ Params: { id: string } }>('/:id', { schema: deleteClipboardSchema }, async (request: FastifyRequest<DeleteClipboardRequest>, reply: FastifyReply) => {
    const { id } = request.params;
    try {
      await fastify.prisma.clipboardEntry.delete({
        where: { id },
      });
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return reply.status(404).send({ error: 'Clipboard entry not found' });
      }
      throw error;
    }
  });
};

export default clipboardRoutes;
