import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1788713486574 implements MigrationInterface {
    name = 'InitialMigration1788713486574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "SYSTEM_USER" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "isNotificationEnabled" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_5b250ddb22b3e4f8234ab172021" UNIQUE ("email"), CONSTRAINT "PK_3f5912604df1254054eac4f2b5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "WATER_REPORT" ("id" SERIAL NOT NULL, "address" character varying(255) NOT NULL, "description" text NOT NULL, "severity" character varying(10) NOT NULL, "reporterPhone" character varying(20) NOT NULL, "isResolved" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b232cdd6d3e95978564720c2ebe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "WATER_REPORT"`);
        await queryRunner.query(`DROP TABLE "SYSTEM_USER"`);
    }

}
