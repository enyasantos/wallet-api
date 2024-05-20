import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Transaction } from "../database/entities/transaction.entity";
import { User } from "../database/entities/user.entity";
import { Wallet } from "../database/entities/wallet.entity";
import { WalletType } from "../lib/types/wallet.type";
import { UserRepositoryImpl } from "../repositories/user.repository";
import { WalletRepositoryImpl } from "../repositories/wallet.repository";

export class WalletRoutes {
    private walletRepository;
    private userRepository;

    constructor(private server: FastifyInstance) {
        this.walletRepository = new WalletRepositoryImpl(
            server.orm['typeorm'].getRepository(Wallet), 
            server.orm['typeorm'].getRepository(Transaction)
        );
        this.userRepository = new UserRepositoryImpl(server.orm['typeorm'].getRepository(User));

        this.server.post<{Body: WalletType}>(
            "/api/wallet", 
            {preHandler: [server.authenticate]}, 
            this.createWallet
        );
        this.server.get<{Params: { id: string }}>(
            "/api/wallet/:id",
            {preHandler: [server.authenticate]},
            this.getWalletById
        );
        this.server.get(
            "/api/wallet/@me",
            {preHandler: [server.authenticate]},
            this.getWalletByUser
        );
        this.server.delete<{Params: { id: string }}>(
            "/api/wallet/:id",
            {preHandler: [server.authenticate]},
            this.deleteWallet
        );
        this.server.put<{Params: { id: string }; Body: WalletType }>(
            "/api/wallet/:id",
            {preHandler: [server.authenticate]},
            this.updateWallet
        );
        this.server.get<{Params: { id: string }}>(
            "/api/wallet/balance/:id", 
            {preHandler: [server.authenticate]}, 
            this.getWalletBalance
        );
    }


    private createWallet = async (
        request: FastifyRequest<{ Body: WalletType }>,
        reply: FastifyReply
    ) => {
        try {
            const { name } = request.body;
            const { id } = request.user;
            const user = await this.userRepository.find(id);
            if (!user) 
                return reply.code(404).send({ error: "User not found" });

            const wallet = new Wallet();
            wallet.name = name
            wallet.user = user
            await this.walletRepository.create(wallet);
            return reply.code(200).send({ success: true, data: {wallet} });
         
        } catch (error) {
            return reply.code(400).send({ error: error });
        }
    };

    private getWalletById = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id: userId } = request.user;
            const { id } = request.params;

            const wallet = await this.walletRepository.find(id);
            if (!wallet) 
                return reply.code(404).send({ error: "Wallet not found" });

            if (userId !== wallet?.user.id) 
                return reply.code(404).send({ error: "Wallet not found or does not belong to the user" });
            
            return reply.code(200).send({ success: true, data: { wallet } });
            
        } catch (error) {
            return reply.code(400).send({ error: error });
        }
    };

    private getWalletByUser = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        try {
            const { id: userId } = request.user;
            const user = await this.userRepository.find(userId);
            if (!user) 
                return reply.code(404).send({ error: "User not found" });
          
            const wallet = await this.walletRepository.findByUser(userId);
            return reply.code(200).send({ success: true, data: { wallet } });
           
        } catch (error) {
            return reply.code(400).send({ error: error });
        }
    };

    private deleteWallet = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id: userId } = request.user;
            const { id } = request.params;
            
            const wallet = await this.walletRepository.find(id);
            if (!wallet) 
                return  reply.code(404).send({ error: "Wallet not found" });
            
            if (userId !== wallet?.user.id) 
                return reply.code(404).send({ error: "Wallet not found or does not belong to the user" });
            
            await this.walletRepository.remove(wallet);
            return reply.code(200).send({ success: true });
           
        } catch (error) {
            return reply.code(400).send({ error: error });
        }
    };

    private updateWallet = async (
        request: FastifyRequest<{ Params: { id: string }; Body: WalletType }>,
        reply: FastifyReply
    ) => {
        try {
            const { id: userId } = request.user;
            const { id } = request.params;
            const { name } = request.body;
            const wallet = await this.walletRepository.find(id);

            if (!wallet) 
                return reply.code(404).send({ error: "Wallet not found" });

            if (userId !== wallet?.user.id) 
                return reply.code(404).send({ error: "Wallet not found or does not belong to the user" });
       
            wallet.name = name;
            await this.walletRepository.save(wallet);
            return reply.code(200).send({ success: true, data: { wallet } });
            
        } catch (error) {
            return reply.code(400).send({ error  });
        }
    };

    private getWalletBalance = async (
        request: FastifyRequest<{ Params: { id: string }}>,
        reply: FastifyReply
    ) => {
        try {
            const { id: userId } = request.user;
            const { id } = request.params;
            const wallet = await this.walletRepository.find(id);
            
            if (!wallet) 
                return reply.code(404).send({ error: "Wallet not found" });
            console.log(wallet)
            console.log(userId, wallet?.user?.id) 
            
            if (userId !== wallet?.user.id) 
                return reply.code(404).send({ error: "Wallet not found or does not belong to the user" });
            

            const balance =  await this.walletRepository.getBalance(id);
            return reply.code(200).send({ success: true, data: { balance } });
            
        } catch (error) {
            return reply.code(400).send({ error  });
        }
    };

    
}
