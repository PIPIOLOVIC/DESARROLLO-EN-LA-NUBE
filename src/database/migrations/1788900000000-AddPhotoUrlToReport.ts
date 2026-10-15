import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhotoUrlToReport1788900000000 implements MigrationInterface {
  name = 'AddPhotoUrlToReport1788900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "WATER_REPORT" ADD "photoUrl" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "WATER_REPORT" ADD "repairPhotoUrl" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "WATER_REPORT" DROP COLUMN "repairPhotoUrl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WATER_REPORT" DROP COLUMN "photoUrl"`,
    );
  }
}
