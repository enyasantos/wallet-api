import "@fastify/jwt"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string } // payload type is used for signing and verifying
    user: {
      id: string,
      name: string,
      email: number
    } // user type is return type of `request.user` object
  }
}