import { Repository } from "typeorm";
import { StatusTransactionType, Transaction } from "../database/entities/transaction.entity";
import { TransactionRepository } from "../database/repositories/transaction.repository";

export class TransactionRepositoryImpl implements TransactionRepository {
    constructor(
        private readonly repository: Repository<Transaction>
    ) {}
    
    async index(): Promise<Transaction[] | null> {
        return this.repository.find();
    }

    async find(id: string): Promise<Transaction | null> {
        return this.repository.findOne({
            where: {id},
            relations: {
                wallet: true
            }
        });
    }

    async create(transaction: Transaction): Promise<Transaction> {
        return await this.repository.save(transaction);
    }

    async update(id: string, transaction: Transaction): Promise<Transaction> {
        await this.repository.update(id, transaction)
        return transaction
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async remove(transaction: Transaction): Promise<Transaction> {
        return await this.repository.remove(transaction);
    }

    async save(transaction: Transaction): Promise<Transaction> {
        return await this.repository.save(transaction);
    }

    async changeStatus(id: string, status: StatusTransactionType): Promise<Transaction | null> {
        const transaction = await this.repository.findOne({where: {id}});

        if (!transaction) {
            return null;
        }

        transaction.status = status;
        await this.repository.save(transaction);
        return transaction;
    }

    async findByWallet(walletId: string): Promise<Transaction[]> {
        return await this.repository.find({where: {
            wallet: {
                id: walletId
            }
        }});
    }
}