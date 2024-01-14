import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1705252830197 implements MigrationInterface {
    name = 'Init1705252830197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "event" (
                "id" BIGSERIAL NOT NULL,
                "name" character varying NOT NULL,
                "during" daterange NOT NULL,
                "description" character varying,
                CONSTRAINT "reservation_during_excl" EXCLUDE USING GIST (during WITH &&),
                CONSTRAINT "pk_event_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "event"
        `);
    }

}
