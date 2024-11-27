import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableTrascations1732695132319 implements MigrationInterface {
    name = 'AddTableTrascations1732695132319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('pending', 'ongoing', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_paymentstatus_enum" AS ENUM('unpaid', 'paid', 'partially_paid')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "productId" uuid NOT NULL, "rentalStartDate" TIMESTAMP NOT NULL DEFAULT now(), "rentalEndDate" TIMESTAMP, "actualReturnDate" TIMESTAMP, "dailyRentalRate" numeric(10,2) NOT NULL, "totalRentalPrice" numeric(10,2) NOT NULL, "status" "public"."transactions_status_enum" NOT NULL, "paymentStatus" "public"."transactions_paymentstatus_enum" NOT NULL, "securityDeposit" numeric(10,2), "lateFee" numeric(10,2), "notes" text, "categoryId" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_5642b5bed5c9404a1424df580f1" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_86e965e74f9cc66149cf6c90f64" FOREIGN KEY ("categoryId") REFERENCES "category_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_86e965e74f9cc66149cf6c90f64"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_5642b5bed5c9404a1424df580f1"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_paymentstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
    }

}
