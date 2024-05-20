import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Transaction } from "../database/entities/transaction.entity";
import { User } from "../database/entities/user.entity";
import { TransactionType } from "../lib/types/transaction.type";
import { TransactionStatusType } from "../lib/types/transaction_status.type";
import { TransactionRepositoryImpl } from "../repositories/transaction.repository";
import { UserRepositoryImpl } from "../repositories/user.repository";

export class TransactionRoutes {
    private transactionRepository;
    private userRepository;

    constructor(private server: FastifyInstance) {
        this.transactionRepository = new TransactionRepositoryImpl(
            server.orm['typeorm'].getRepository(Transaction)
        );
        this.userRepository = new UserRepositoryImpl(
            server.orm['typeorm'].getRepository(User)
        );

        this.server.post<{Body: TransactionType}>(
            "/api/transaction", 
            {preHandler: [server.authenticate]}, 
            this.createTransaction
        );
        this.server.get<{Params: { id: string }}>(
            "/api/transaction",
            {preHandler: [server.authenticate]},
            this.getTransactionById
        );
        this.server.get(
            "/api/transaction/wallet/@me",
            {preHandler: [server.authenticate]},
            this.getTransactionByWalletUser
        );
        this.server.delete<{Params: { id: string }}>(
            "/api/transaction",
            {preHandler: [server.authenticate]},
            this.deleteTransaction
        );
        this.server.patch<{Params: { id: string }; Body: TransactionStatusType}>(
            "/api/transaction/status", 
            {preHandler: [server.authenticate]}, 
            this.updateStatusTransaction
        );
    }


    private createTransaction = async (
        request: FastifyRequest<{ Body: TransactionType }>,
        reply: FastifyReply
    ) => {
        try {
            const { amount, description, status, transaction_at, type } = request.body;
            const { id } = request.user;
            const user = await this.userRepository.find(id);
            if (!user) 
                return reply.code(404).send({ error: "User not found" });
            
            const transaction = new Transaction();
            transaction.description = description
            transaction.amount = amount
            transaction.status = status
            transaction.transaction_at = transaction_at
            transaction.type = type
            transaction.wallet = user?.wallet
            
            await this.transactionRepository.create(transaction);
            return reply.code(200).send({ success: true });
            
        } catch (error) {
            return reply.code(400).send({ error: error });
        }
    };

    private getTransactionById = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = request.params;
            const wallet = await this.transactionRepository.find(id);
            if (!wallet) 
                return reply.code(404).send({ error: "Transaction not found" });
            
            return reply.code(200).send({ success: true, data: { wallet } });
        } catch (error) {
            reply.code(400).send({ error: error });
        }
    };

    private getTransactionByWalletUser = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        try {
            const { id: userId } = request.user;
            const user = await this.userRepository.find(userId);
            if (!user) {
                reply.code(404).send({ error: "User not found" });
            } else {
                const wallet = await this.transactionRepository.findByWallet(user?.wallet?.id);
                reply.code(200).send({ success: true, data: { wallet } });
            }
        } catch (error) {
            reply.code(400).send({ error: error });
        }
    };

    private deleteTransaction = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = request.params;
            const transaction = await this.transactionRepository.find(id);
            if (!transaction) 
                return reply.code(404).send({ error: "Transaction not found" });
            
            await this.transactionRepository.remove(transaction);
            return reply.code(200).send({ success: true });
            
        } catch (error) {
            reply.code(400).send({ error: error });
        }
    };

    private updateStatusTransaction = async (
        request: FastifyRequest<{ Params: { id: string }; Body: TransactionStatusType }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = request.user;
            const { status } = request.body;
            const transaction = await this.transactionRepository.find(id);
            if (!transaction)
                return reply.code(404).send({ error: "Transaction not found" });

            transaction.status = status;
            await this.transactionRepository.save(transaction);
            return reply.code(200).send({ success: true, data: { transaction } });
            
        } catch (error) {
            reply.code(400).send({ error });
        }
    };
}
