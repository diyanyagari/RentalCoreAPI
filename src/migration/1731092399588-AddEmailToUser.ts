import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailToUser1731092399588 implements MigrationInterface {
    name = 'AddEmailToUser1731092399588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Add 'email' column as nullable initially
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);

        // Step 2: Set a unique placeholder for existing rows, if necessary
        await queryRunner.query(`UPDATE "user" SET "email" = 'default_' || id || '@example.com' WHERE "email" IS NULL`);

        // Step 3: Apply NOT NULL constraint since all rows have an email value
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`);

        // Step 4: Add UNIQUE constraint
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_user_email" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Drop the UNIQUE constraint
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_user_email"`);

        // Step 2: Drop the email column
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    }
}
