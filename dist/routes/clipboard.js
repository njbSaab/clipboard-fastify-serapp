"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const clopboard_1 = require("../schemas/clopboard");
const clipboardRoutes = async (fastify) => {
    // POST /clipboard — создать запись
    fastify.post('/', { schema: clopboard_1.createClipboardSchema }, async (request, reply) => {
        const { content } = request.body;
        const item = await fastify.prisma.clipboardEntry.create({
            data: { content },
        });
        return reply.status(201).send(item);
    });
    // GET /clipboard — получить все записи
    fastify.get('/', async (request, reply) => {
        const items = await fastify.prisma.clipboardEntry.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return reply.send(items);
    });
    // PATCH /clipboard/:id/favorite — переключить статус избранного
    fastify.patch('/:id/favorite', { schema: clopboard_1.toggleFavoriteSchema }, async (request, reply) => {
        const { id } = request.params;
        const { favorite } = request.body;
        try {
            const item = await fastify.prisma.clipboardEntry.update({
                where: { id },
                data: { favorite },
            });
            return reply.send(item);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return reply.status(404).send({ error: 'Clipboard entry not found' });
            }
            throw error;
        }
    });
    // GET /clipboard/frequent — получить часто используемые записи
    fastify.get('/frequent', async (request, reply) => {
        const items = await fastify.prisma.clipboardEntry.findMany({
            orderBy: { usageCount: 'desc' },
            take: 10,
        });
        return reply.send(items);
    });
    // POST /clipboard/:id/increment — инкремент usageCount
    fastify.post('/:id/increment', async (request, reply) => {
        const { id } = request.params;
        try {
            const item = await fastify.prisma.clipboardEntry.update({
                where: { id },
                data: { usageCount: { increment: 1 } },
            });
            return reply.send(item);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return reply.status(404).send({ error: 'Clipboard entry not found' });
            }
            throw error;
        }
    });
    // DELETE /clipboard/:id — удалить запись
    fastify.delete('/:id', { schema: clopboard_1.deleteClipboardSchema }, async (request, reply) => {
        const { id } = request.params;
        try {
            await fastify.prisma.clipboardEntry.delete({
                where: { id },
            });
            return reply.status(204).send();
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return reply.status(404).send({ error: 'Clipboard entry not found' });
            }
            throw error;
        }
    });
};
exports.default = clipboardRoutes;
//# sourceMappingURL=clipboard.js.map