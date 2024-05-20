import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "./transaction.entity";
import { User } from "./user.entity";

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 500})
    name!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToOne(() => User, (user) => user.wallet)
    @JoinColumn()
    user!: User

    @OneToMany(() => Transaction, (transaction) => transaction.wallet)
    transactions!: Transaction[]
}