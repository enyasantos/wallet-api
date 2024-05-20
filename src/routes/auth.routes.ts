import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BcryptAdapter } from "../adapters/bcrypt.adapter";
import { User } from "../database/entities/user.entity";

export class AuthRoutes {
    private userRepository;
    private bcrypt

    constructor(private server: FastifyInstance) {
        this.bcrypt = new BcryptAdapter(10)
        this.userRepository = server.orm['typeorm'].getRepository(User);
        this.server.post("/api/auth", this.login);
    }

    private login = async (
        request: FastifyRequest<{ Body: {email: string, password: string} }>,
        reply: FastifyReply
    ) => {
        const { email, password } = request.body
        const user = await this.userRepository.findOne({ where: { email } })
    
        const isMatch = user && (await this.bcrypt.compare(password, user.password))
        if (!user || !isMatch) {
          return reply.code(401).send({
            message: 'Invalid email or password',
          })
        }

        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
        }

        const token = request.jwt.sign(payload)

        reply.setCookie('access_token', token, {
            path: '/',
            httpOnly: true,
            secure: true,
        })
        
        return { accessToken: token }
    }
}