"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const env_1 = __importDefault(require("@fastify/env"));
const cors_1 = __importDefault(require("@fastify/cors")); // Импортируем плагин CORS
const path_1 = require("path");
const clipboard_1 = __importDefault(require("./routes/clipboard"));
const notes_1 = __importDefault(require("./routes/notes"));
const prisma_1 = __importDefault(require("./plugins/prisma"));
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
const server = (0, fastify_1.default)({ logger: true });
// Регистрация плагина для .env
server.register(env_1.default, {
    confKey: 'config',
    schema,
    dotenv: { path: (0, path_1.join)(__dirname, '../.env') },
});
// Регистрация CORS
server.register(cors_1.default, {
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
server.register(prisma_1.default);
// Регистрация маршрутов
server.register(clipboard_1.default, { prefix: '/clipboard' });
server.register(notes_1.default, { prefix: '/notes' });
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
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map