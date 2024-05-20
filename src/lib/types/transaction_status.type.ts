import { Static, Type } from "@sinclair/typebox";
import { StatusTransactionType } from "../../database/entities/transaction.entity";

export const TransactionStatus = Type.Object({
  status: Type.Enum(StatusTransactionType),
});

export type TransactionStatusType = Static<typeof TransactionStatus>;