"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const notes_1 = require("../schemas/notes");
const notesRoutes = async (fastify) => {
    // POST /notes — создать заметку
    fastify.post('/', { schema: notes_1.createNoteSchema }, async (request, reply) => {
        const { title, content } = request.body;
        const note = await fastify.prisma.note.create({
            data: { title, content },
        });
        return reply.status(201).send(note);
    });
    // GET /notes — получить все заметки
    fastify.get('/', async (request, reply) => {
        const notes = await fastify.prisma.note.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return reply.send(notes);
    });
    // PATCH /notes/:id/favorite — переключить статус избранного
    fastify.patch('/:id/favorite', { schema: notes_1.toggleFavoriteSchema }, async (request, reply) => {
        const { id } = request.params;
        const { favorite } = request.body;
        try {
            const note = await fastify.prisma.note.update({
                where: { id },
                data: { favorite },
            });
            return reply.send(note);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return reply.status(404).send({ error: 'Note not found' });
            }
            throw error;
        }
    });
    // DELETE /notes/:id — удалить заметку
    fastify.delete('/:id', { schema: notes_1.deleteNoteSchema }, async (request, reply) => {
        const { id } = request.params;
        try {
            await fastify.prisma.note.delete({
                where: { id },
            });
            return reply.status(204).send();
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return reply.status(404).send({ error: 'Note not found' });
            }
            throw error;
        }
    });
};
exports.default = notesRoutes;
//# sourceMappingURL=notes.js.map