import { MigrationInterface, QueryRunner } from "typeorm";

export class BookRole1767696334916 implements MigrationInterface {
    name = 'BookRole1767696334916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`role\` enum('user', 'manager', 'admin') NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role\``);
    }

}
