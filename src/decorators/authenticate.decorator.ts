import { FastifyJWT } from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from "fastify";

const AuthenticateDecorator = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token

    if (!token) {
    return reply.status(401).send({ message: 'Authentication required' })
    }
    // here decoded will be a different type by default but we want it to be of user-payload type
    const decoded = req.jwt.verify<FastifyJWT['user']>(token)
    req.user = decoded
}

export { AuthenticateDecorator };
