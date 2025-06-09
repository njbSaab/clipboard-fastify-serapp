import { FastifyPluginAsync, FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Note, Prisma } from '@prisma/client';
import { createNoteSchema, toggleFavoriteSchema, deleteNoteSchema } from '../schemas/notes';

interface CreateNoteRequest {
  Body: { title: string; content: string };
}

interface ToggleFavoriteRequest {
  Params: { id: string };
  Body: { favorite: boolean };
}

interface DeleteNoteRequest {
  Params: { id: string };
}

const notesRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // POST /notes — создать заметку
  fastify.post<{ Body: { title: string; content: string } }>('/', { schema: createNoteSchema }, async (request: FastifyRequest<CreateNoteRequest>, reply: FastifyReply) => {
    const { title, content } = request.body;
    const note: Note = await fastify.prisma.note.create({
      data: { title, content },
    });
    return reply.status(201).send(note);
  });

  // GET /notes — получить все заметки
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const notes: Note[] = await fastify.prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return reply.send(notes);
  });

  // PATCH /notes/:id/favorite — переключить статус избранного
  fastify.patch<{ Params: { id: string }; Body: { favorite: boolean } }>('/:id/favorite', { schema: toggleFavoriteSchema }, async (request: FastifyRequest<ToggleFavoriteRequest>, reply: FastifyReply) => {
    const { id } = request.params;
    const { favorite } = request.body;
    try {
      const note: Note = await fastify.prisma.note.update({
        where: { id },
        data: { favorite },
      });
      return reply.send(note);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return reply.status(404).send({ error: 'Note not found' });
      }
      throw error;
    }
  });

  // DELETE /notes/:id — удалить заметку
  fastify.delete<{ Params: { id: string } }>('/:id', { schema: deleteNoteSchema }, async (request: FastifyRequest<DeleteNoteRequest>, reply: FastifyReply) => {
    const { id } = request.params;
    try {
      await fastify.prisma.note.delete({
        where: { id },
      });
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return reply.status(404).send({ error: 'Note not found' });
      }
      throw error;
    }
  });
};

export default notesRoutes;