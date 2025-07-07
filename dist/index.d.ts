declare module 'fastify' {
    interface FastifyInstance {
        config: {
            PORT: number;
            DATABASE_URL: string;
            SHADOW_DATABASE_URL?: string;
        };
    }
}
export {};
