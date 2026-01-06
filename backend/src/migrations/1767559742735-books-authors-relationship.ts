import { MigrationInterface, QueryRunner } from "typeorm";

export class BooksAuthorsRelationship1767559742735 implements MigrationInterface {
    name = 'BooksAuthorsRelationship1767559742735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`books_authors_authors\` (\`booksId\` int NOT NULL, \`authorsId\` int NOT NULL, INDEX \`IDX_25a2cff0aa5b6d28dfbfd1f40c\` (\`booksId\`), INDEX \`IDX_5869907ade47c42570389388d2\` (\`authorsId\`), PRIMARY KEY (\`booksId\`, \`authorsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`books_authors_authors\` ADD CONSTRAINT \`FK_25a2cff0aa5b6d28dfbfd1f40ca\` FOREIGN KEY (\`booksId\`) REFERENCES \`books\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`books_authors_authors\` ADD CONSTRAINT \`FK_5869907ade47c42570389388d25\` FOREIGN KEY (\`authorsId\`) REFERENCES \`authors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`books_authors_authors\` DROP FOREIGN KEY \`FK_5869907ade47c42570389388d25\``);
        await queryRunner.query(`ALTER TABLE \`books_authors_authors\` DROP FOREIGN KEY \`FK_25a2cff0aa5b6d28dfbfd1f40ca\``);
        await queryRunner.query(`DROP INDEX \`IDX_5869907ade47c42570389388d2\` ON \`books_authors_authors\``);
        await queryRunner.query(`DROP INDEX \`IDX_25a2cff0aa5b6d28dfbfd1f40c\` ON \`books_authors_authors\``);
        await queryRunner.query(`DROP TABLE \`books_authors_authors\``);
    }

}
