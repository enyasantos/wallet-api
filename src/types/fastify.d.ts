import { JWT } from '@fastify/jwt';
import 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        jwt: JWT;
        authenticate: any
    }
    interface FastifyRequest {
        jwt: JWT;
        user: {
            id: string,
            name: string,
            email: number
        },
    }
}
