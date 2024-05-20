import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Wallet } from "./wallet.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 500})
    name!: string;

    @Column({ type: "varchar", length: 500})
    password!: string;

    @Column({ type: "varchar", length: 500, unique: true})
    email!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToOne(() => Wallet, (wallet) => wallet.user)
    wallet!: Wallet
}