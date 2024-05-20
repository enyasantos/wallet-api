import { IGenericRepository } from "../../abstracts/generic-repository-abstract";
import { Wallet } from "../entities/wallet.entity";

export abstract class WalletRepository extends IGenericRepository<Wallet>{
    abstract getBalance(id: string): Promise<number | null>;
    abstract findByUser(userId: string): Promise<Wallet | null>;
}