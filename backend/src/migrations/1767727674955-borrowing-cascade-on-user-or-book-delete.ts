import { MigrationInterface, QueryRunner } from "typeorm";

export class BorrowingCascadeOnUserOrBookDelete1767727674955 implements MigrationInterface {
    name = 'BorrowingCascadeOnUserOrBookDelete1767727674955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`borrowings\` DROP FOREIGN KEY \`FK_151ca9466056600f08958b3432d\``);
        await queryRunner.query(`ALTER TABLE \`borrowings\` DROP FOREIGN KEY \`FK_5da2b7ee3b60c381d4bbdb50668\``);
        await queryRunner.query(`ALTER TABLE \`borrowings\` ADD CONSTRAINT \`FK_151ca9466056600f08958b3432d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`borrowings\` ADD CONSTRAINT \`FK_5da2b7ee3b60c381d4bbdb50668\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`borrowings\` DROP FOREIGN KEY \`FK_5da2b7ee3b60c381d4bbdb50668\``);
        await queryRunner.query(`ALTER TABLE \`borrowings\` DROP FOREIGN KEY \`FK_151ca9466056600f08958b3432d\``);
        await queryRunner.query(`ALTER TABLE \`borrowings\` ADD CONSTRAINT \`FK_5da2b7ee3b60c381d4bbdb50668\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`borrowings\` ADD CONSTRAINT \`FK_151ca9466056600f08958b3432d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
