import Fastify, { FastifyInstance } from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyCors from '@fastify/cors'; // Импортируем плагин CORS
import { join } from 'path';
import clipboardRoutes from './routes/clipboard';
import notesRoutes from './routes/notes';
import prismaPlugin from './plugins/prisma';

// Схема для валидации .env
const schema = {
  type: 'object',
  required: ['PORT', 'DATABASE_URL'],
  properties: {
    PORT: { type: 'number', default: 3000 },
    DATABASE_URL: { type: 'string' },
    SHADOW_DATABASE_URL: { type: 'string' },
  },
};

const server: FastifyInstance = Fastify({ logger: true });

// Регистрация плагина для .env
server.register(fastifyEnv, {
  confKey: 'config',
  schema,
  dotenv: { path: join(__dirname, '../.env') },
});

// Регистрация CORS
server.register(fastifyCors, {
  origin: ['http://localhost:4200'], // Разрешаем запросы только с http://localhost:4200
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Разрешенные методы
  allowedHeaders: ['Content-Type'], // Разрешенные заголовки
  credentials: true, // Если нужны куки или авторизация
});

// Базовый маршрут
server.get('/', async (request, reply) => {
  return reply.status(200).send({ message: 'Hello, Fastify!' });
});

// Регистрация плагина Prisma
server.register(prismaPlugin);

// Регистрация маршрутов
server.register(clipboardRoutes, { prefix: '/clipboard' });
server.register(notesRoutes, { prefix: '/notes' });

// Отладочный вывод зарегистрированных маршрутов
server.ready().then(() => {
  server.log.info('Registered routes:');
  server.printRoutes();
});

const start = async () => {
  try {
    await server.ready();
    await server.listen({ port: server.config.PORT, host: '0.0.0.0' });
    server.log.info(`Server running on http://localhost:${server.config.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

// Расширение типов для config
declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      DATABASE_URL: string;
      SHADOW_DATABASE_URL?: string;
    };
  }
}