import { IGenericRepository } from "../../abstracts/generic-repository-abstract";
import { StatusTransactionType, Transaction } from "../entities/transaction.entity";

export abstract class TransactionRepository extends IGenericRepository<Transaction>{
    abstract changeStatus(id: string, status: StatusTransactionType): Promise<Transaction | null>;
    abstract findByWallet(walletId: string): Promise<Transaction[]>;
}