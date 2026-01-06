import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1767551070166 implements MigrationInterface {
    name = 'Initial1767551070166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`authors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`bio\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`books\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`stock\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`borrowings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateBorrowed\` datetime NOT NULL, \`userId\` int NOT NULL, \`bookId\` int NOT NULL, \`isReturned\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`, \`dateBorrowed\`, \`userId\`, \`bookId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`passwordHash\` varchar(255) NOT NULL, \`borrowingsId\` int NULL, \`borrowingsDateBorrowed\` datetime NULL, \`borrowingsUserId\` int NULL, \`borrowingsBookId\` int NULL, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`borrowings\` ADD CONSTRAINT \`FK_151ca9466056600f08958b3432d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`borrowings\` ADD CONSTRAINT \`FK_5da2b7ee3b60c381d4bbdb50668\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_59ff3049365e38e1e6384396d82\` FOREIGN KEY (\`borrowingsId\`, \`borrowingsDateBorrowed\`, \`borrowingsUserId\`, \`borrowingsBookId\`) REFERENCES \`borrowings\`(\`id\`,\`dateBorrowed\`,\`userId\`,\`bookId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_59ff3049365e38e1e6384396d82\``);
        await queryRunner.query(`ALTER TABLE \`borrowings\` DROP FOREIGN KEY \`FK_5da2b7ee3b60c381d4bbdb50668\``);
        await queryRunner.query(`ALTER TABLE \`borrowings\` DROP FOREIGN KEY \`FK_151ca9466056600f08958b3432d\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`borrowings\``);
        await queryRunner.query(`DROP TABLE \`books\``);
        await queryRunner.query(`DROP TABLE \`authors\``);
    }

}
