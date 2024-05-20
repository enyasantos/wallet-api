import { IGenericRepository } from "../../abstracts/generic-repository-abstract";
import { User } from "../entities/user.entity";

export abstract class UserRepository extends IGenericRepository<User>{}