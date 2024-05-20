import { Repository } from "typeorm";
import { Transaction, TypeTransactionType } from "../database/entities/transaction.entity";
import { Wallet } from "../database/entities/wallet.entity";
import { WalletRepository } from "../database/repositories/wallet.repository";

export class WalletRepositoryImpl implements WalletRepository {
    constructor(
        private readonly repository: Repository<Wallet>,
        private readonly transactionRepository: Repository<Transaction>
    ) {}
    
    async index(): Promise<Wallet[] | null> {
        return this.repository.find();
    }

    async find(id: string): Promise< Wallet | null> {
        return this.repository.findOne({
            where: {id},
            relations: {
                user: true
            }
        });
    }

    async create(wallet:  Wallet): Promise< Wallet> {
        return await this.repository.save(wallet);
    }

    async update(id: string, wallet: Wallet): Promise<Wallet> {
        await this.repository.update(id, wallet)
        return wallet
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async remove(wallet: Wallet): Promise<Wallet> {
        return await this.repository.remove(wallet);
    }

    async save(wallet: Wallet): Promise<Wallet> {
        return await this.repository.save(wallet);
    }

    async getBalance(id: string): Promise<number | null> {
        // const transactions = await this.transactionRepository.find({ where: { wallet: { id: id } } });
        // let balance = 0;
        // transactions.forEach((transaction) => {
        //     if (transaction.type === "deposit") {
        //         balance += transaction.amount;
        //     } else if (transaction.type === "withdrawal") {
        //         balance -= transaction.amount;
        //     }
        // });

        const queryResult  = await this.transactionRepository.createQueryBuilder("transaction")
            .select("SUM(CASE WHEN transaction.type = :deposit THEN transaction.amount ELSE 0 END)", "totalDeposits")
            .addSelect("SUM(CASE WHEN transaction.type = :withdrawal THEN transaction.amount ELSE 0 END)", "totalWithdrawals")
            .setParameters({ deposit: TypeTransactionType.DEPOSIT, withdrawal: TypeTransactionType.WITHDRAWAL })
            .where("transaction.wallet.id = :id", { id })
            .getRawOne();

        const totalDeposits = parseFloat(queryResult.totalDeposits) || 0;
        const totalWithdrawals = parseFloat(queryResult.totalWithdrawals) || 0;
    
        const balance = totalDeposits - totalWithdrawals;
        return balance;
    }

    async findByUser(userId: string): Promise<Wallet | null> {
        return this.repository.findOne({where: {
            user: {
                id: userId
            }
        }});
    }
}
