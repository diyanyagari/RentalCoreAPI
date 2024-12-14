import { MigrationInterface, QueryRunner } from "typeorm";

export class EditTypeIDUser1734181542548 implements MigrationInterface {
  name = "EditTypeIDUser1734181542548";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "id" TYPE UUID USING "id"::uuid`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "id" TYPE INT USING "id"::int`
    );
  }
}
