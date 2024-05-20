import { Static, Type } from "@sinclair/typebox";

export const Wallet = Type.Object({
  name: Type.String(),
});

export type WalletType = Static<typeof Wallet>;