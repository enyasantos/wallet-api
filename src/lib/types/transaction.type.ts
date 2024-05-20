import { Static, Type } from "@sinclair/typebox";
import { StatusTransactionType, TypeTransactionType } from "../../database/entities/transaction.entity";

export const Transaction = Type.Object({
  description: Type.String(),
  type: Type.Enum(TypeTransactionType),
  amount: Type.Number(),
  status: Type.Enum(StatusTransactionType),
  transaction_at: Type.Date()
});

export type TransactionType = Static<typeof Transaction>;