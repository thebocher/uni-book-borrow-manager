import { MigrationInterface, QueryRunner } from "typeorm";

export class UserModelFixedBorrowingRelation1767564284344 implements MigrationInterface {
    name = 'UserModelFixedBorrowingRelation1767564284344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_59ff3049365e38e1e6384396d82\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`borrowingsId\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`borrowingsDateBorrowed\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`borrowingsUserId\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`borrowingsBookId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`borrowingsBookId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`borrowingsUserId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`borrowingsDateBorrowed\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`borrowingsId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_59ff3049365e38e1e6384396d82\` FOREIGN KEY (\`borrowingsId\`, \`borrowingsDateBorrowed\`, \`borrowingsUserId\`, \`borrowingsBookId\`) REFERENCES \`borrowings\`(\`id\`,\`dateBorrowed\`,\`userId\`,\`bookId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
