import { MigrationInterface, QueryRunner } from "typeorm";

export class Latest1732467197691 implements MigrationInterface {
    name = 'Latest1732467197691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "categoryProductID" uuid, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_f132cc7be455c359ba84d1e7246" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_2f4f745690ada4ebaeca647e238" FOREIGN KEY ("categoryProductID") REFERENCES "category_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_2f4f745690ada4ebaeca647e238"`);
        await queryRunner.query(`DROP TABLE "category_product"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
