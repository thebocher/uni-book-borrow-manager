import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './models/book.model';
import { BooksService } from './services/books.service';
import { BooksController } from './controllers/books.controller';
import { AuthorsModule } from '../authors/authors.module';

@Module({
    providers: [BooksService],
    controllers: [BooksController],
    imports: [TypeOrmModule.forFeature([Book]), AuthorsModule],
    exports: [BooksService, TypeOrmModule],
})
export class BooksModule {}
