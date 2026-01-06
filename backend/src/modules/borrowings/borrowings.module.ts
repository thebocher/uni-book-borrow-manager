import { Module } from '@nestjs/common';
import { Borrowing } from './models/borrowing.model';
import { BorrowingService } from './services/borrowing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowingController } from './controllers/borrowing.controller';
import { BooksModule } from '../books/books.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Borrowing]), BooksModule, UsersModule],
    providers: [BorrowingService],
    controllers: [BorrowingController],
    exports: [BorrowingService, TypeOrmModule],
})
export class BorrowingsModule {}
