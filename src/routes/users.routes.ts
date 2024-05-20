import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BcryptAdapter } from "../adapters/bcrypt.adapter";
import { User } from "../database/entities/user.entity";
import { UserType } from "../lib/types/user.type";
import { UserRepositoryImpl } from "../repositories/user.repository";

export class UserRoutes {
    private userRepository;
    private bcrypt

    constructor(private server: FastifyInstance) {
        this.bcrypt = new BcryptAdapter(10)
        this.userRepository = new UserRepositoryImpl(server.orm['typeorm'].getRepository(User));
        this.server.get("/api/users", this.getAllUsers);
        this.server.post<{Body: UserType}>("/api/user", { preValidation: this.validateUser }, this.createUser);
        this.server.get<{ Params: { id: string }}>(
            "/api/user",
            {preHandler: [server.authenticate]},
            this.getUserById
        );
        this.server.delete<{ Params: { id: string }}>(
            "/api/user",
            {preHandler: [server.authenticate]},
            this.deleteUser
        );
        this.server.put<{ Params: { id: string }; Body: UserType }>(
            "/api/user",
            {preHandler: [server.authenticate]},
            this.updateUser
        );
    }

    private getAllUsers = async (
        request: FastifyRequest<{ Querystring: unknown }>,
        reply: FastifyReply
    ) => {
        try {
            const users = await this.userRepository.index();
            reply.code(200).send({ success: true, data: { users } });
        } catch (error) {
            reply.code(400).send({ error });
        }
    };

    private createUser = async (
        request: FastifyRequest<{ Body: UserType }>,
        reply: FastifyReply
    ) => {
        try {
            const { email, password, name } = request.body;
            const user = new User();
            user.email = email;
            user.password = await this.bcrypt.encrypt(password);
            user.name = name;
            const result = await this.userRepository.save(user);
            reply.status(201).send({ success: true, data: { user: result } });
        } catch (error) {
            reply.code(400).send({ error });
        }
    };

    private getUserById = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = request.user;
            const user = await this.userRepository.find(id);
            if (!user) {
                reply.code(404).send({ error: "User not found" });
            } else {
                reply.code(200).send({ success: true, data: { user } });
            }
        } catch (error) {
            reply.code(400).send({ error: error });
        }
    };

    private deleteUser = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = request.user;
            const user = await this.userRepository.find(id);
            if (!user) {
                reply.code(404).send({ error: "User not found" });
            } else {
                await this.userRepository.remove(user);
                reply.code(200).send({ success: true });
            }
        } catch (error) {
            reply.code(400).send({ error: error });
        }
    };

    private updateUser = async (
        request: FastifyRequest<{ Params: { id: string }; Body: UserType }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = request.user;
            const { name, password, email } = request.body;
            const user = await this.userRepository.find(id);
            if (!user) {
                reply.code(404).send({ error: "User not found" });
            } else {
                user.name = name;
                user.password = await this.bcrypt.encrypt(password);
                user.email = email;
                await this.userRepository.save(user);
                reply.code(200).send({ success: true, data: { user } });
            }
        } catch (error) {
            reply.code(400).send({ error  });
        }
    };

    private validateUser = (
        request: FastifyRequest<{ Body: UserType }>,
        reply: FastifyReply,
        done: Function
    ) => {
        const { email, password, name } = request.body;
        if (!email) {
            done(new Error("Email is required"));
        } else if (!name) {
            done(new Error("Name is required"));
        } else if (!password && password?.length < 8) {
            done(new Error("Password must be more than 8 characters"));
        } else {
            done();
        }
    };
}
