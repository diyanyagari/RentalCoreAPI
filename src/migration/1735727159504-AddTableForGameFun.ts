import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableForGameFun1735727159504 implements MigrationInterface {
    name = 'AddTableForGameFun1735727159504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "alternate_jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jobname" character varying NOT NULL, CONSTRAINT "PK_5e93e58b558bf899805cb542521" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_choosen" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "targetUserId" uuid NOT NULL, "JobID" uuid NOT NULL, "JobName" character varying NOT NULL, "whoIsChooseUserID" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3ef0342786803f90328cfc5a142" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "job_choosen"`);
        await queryRunner.query(`DROP TABLE "alternate_jobs"`);
    }

}
