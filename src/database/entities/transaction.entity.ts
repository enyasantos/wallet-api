import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Wallet } from "./wallet.entity";

export enum TypeTransactionType {
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal",
    // TRANSFER = "transfer",
    // PAYMENT = "payment",
    // SALARY = "salary",
    // OTHER = "other"
}

export enum StatusTransactionType {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 500})
    description!: string;

    @Column({ 
        type: "enum", 
        enum: TypeTransactionType
    })
    type!: TypeTransactionType;

    @Column('numeric')
    amount!: number;

    @Column({ 
        type: "enum", 
        enum: StatusTransactionType, 
        default: StatusTransactionType.COMPLETED
    })
    status!: StatusTransactionType;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    transaction_at!: Date;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
    @JoinColumn()
    wallet!: Wallet
}