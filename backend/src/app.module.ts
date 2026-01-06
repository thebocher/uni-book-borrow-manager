import { Module } from '@nestjs/common';
import { AuthorsModule } from './modules/authors/authors.module';
import { BorrowingsModule } from './modules/borrowings/borrowings.module';
import { BooksModule } from './modules/books/books.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    AuthorsModule,
    BooksModule,
    BorrowingsModule,
    UsersModule,
    AuthModule,

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT!,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/modules/**/*.model{.ts,.js}'],
      migrations: [__dirname + '/migrations/*.{.ts,.js}'],
      migrationsRun: true,
      logging: 'all',
    }),

    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
