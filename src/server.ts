import type { FastifyCookieOptions } from '@fastify/cookie';
import fjwt from '@fastify/jwt';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import * as dotenv from "dotenv";
import Fastify from "fastify";
import "reflect-metadata";
import { configureDatabase } from "./configs/db.config";
import { AuthenticateDecorator } from './decorators/authenticate.decorator';
import { AuthRoutes } from './routes/auth.routes';
import { TransactionRoutes } from './routes/transactions.routes';
import { UserRoutes } from "./routes/users.routes";
import { WalletRoutes } from './routes/wallets.routes';

dotenv.config();

async function startServer() {
  const server = Fastify({
    logger: true
  }).withTypeProvider<TypeBoxTypeProvider>()

  server.register(fjwt, { secret: 'supersecretcode-CHANGE_THIS-USE_ENV_FILE' })
  server.addHook('preHandler', (req, res, next) => {
    req.jwt = server.jwt
    return next()
  })
  server.register(require('@fastify/cookie'), {
    secret: 'some-secret-key',
    hook: 'preHandler',
  } as FastifyCookieOptions)

  server.decorate(
    'authenticate',
    AuthenticateDecorator
  )

  await configureDatabase(server);

  new AuthRoutes(server)
  new UserRoutes(server)
  new WalletRoutes(server)
  new TransactionRoutes(server)

  const PORT = process.env.PORT || '3000';
  await server.listen({ port: parseInt(PORT, 10), host: '0.0.0.0' });
}

startServer()
  .then(() => {
    console.log(`Server started successfully at ${process.env.PORT  || '3000'}`);
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });