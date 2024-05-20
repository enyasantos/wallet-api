import { Repository } from "typeorm";
import { User } from "../database/entities/user.entity";
import { UserRepository } from "../database/repositories/user.repository";

export class UserRepositoryImpl implements UserRepository {
    constructor(
        private readonly repository: Repository<User>
    ) {}
    
    async index(): Promise<User[] | null> {
        return this.repository.find();
    }

    async find(id: string): Promise<User | null> {
        return this.repository.findOne({
            where: {id},
            relations: {
                wallet: true
            }
        });
    }

    async create(user: User): Promise<User> {
        return await this.repository.save(user);
    }

    async update(id: string, user: User): Promise<User> {
        await this.repository.update(id, user)
        return user
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async remove(user: User): Promise<User> {
        return await this.repository.remove(user);
    }

    async save(user: User): Promise<User> {
        return await this.repository.save(user);
    }
}
