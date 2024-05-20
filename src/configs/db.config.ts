import { FastifyInstance } from "fastify";
import plugin from 'typeorm-fastify-plugin';
import { Transaction } from "../database/entities/transaction.entity";
import { User } from "../database/entities/user.entity";
import { Wallet } from "../database/entities/wallet.entity";

export async function configureDatabase(server: FastifyInstance) {
  try {
    await server.register(plugin, {
        namespace: 'typeorm',
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: process.env.NODE_ENV === 'dev',
        logging: process.env.NODE_ENV === 'dev',
        migrations: [__dirname + '../database/migrations/*.ts'],
        subscribers: [],
        migrationsRun: process.env.NODE_ENV === 'dev',
        entities: [User, Wallet, Transaction],
    });
      console.log('TypeORM configured successfully');
  } catch (error) {
    console.error('Error configuring TypeORM:', error);
    throw error;
  }
}