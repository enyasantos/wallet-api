import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
dotenv.config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.NODE_ENV === 'dev',
    logging: process.env.NODE_ENV === 'dev',
    logger: 'file',
    entities: [__dirname + "/../entities/*.entity{.ts,.js}"],
    migrations: [__dirname + '/*-migrations{.ts,.js}'],
    subscribers: [],
    migrationsRun: process.env.NODE_ENV === 'dev',
});
