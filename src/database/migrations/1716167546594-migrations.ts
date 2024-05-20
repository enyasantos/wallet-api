import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1716167546594 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM ('deposit', 'withdrawal')`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum" AS ENUM ('pending', 'completed', 'cancelled')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`);
    }

}
