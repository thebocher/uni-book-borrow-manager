import { Injectable, NotFoundException } from '@nestjs/common';
import { BooksService } from 'src/modules/books/services/books.service';
import { BookOutOfStock } from '../errors/book-out-of-stock.error';
import { Borrowing } from '../models/borrowing.model';
import { GetBorrowingListItemDto } from '../dtos/get-borrowing-list-item.dto';
import { UserService } from 'src/modules/users/services/user.service';
import { ReturnBorrowedDto } from '../dtos/return-borrowed.dto';
import { AddBorrowingDto } from '../dtos/add-borrowing.dto';
import { DataSource } from 'typeorm';
import { Book } from 'src/modules/books/models/book.model';
import PaginationDto from 'src/common/dtos/pagination';
import { paginate } from 'src/common/paginate';
import { User } from 'src/modules/users/models/user.model';
import { Role } from 'src/modules/users/enums/role.enum';

@Injectable()
export class BorrowingService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly bookService: BooksService,
    private readonly userService: UserService
  ) {}

  async addBorrowingDto(actor: User, dto: AddBorrowingDto) {
    const { userId, bookId } = dto;
    const user = await this.userService.findById(userId);

    const borrowing = await this.dataSource.transaction(async manager => {
      const book = await this.bookService.findById(bookId, manager);

      if (book.stock === 0) {
        throw new BookOutOfStock('Cannot borrow because book is out of stock');
      }

      const now = new Date();
      const borrowing = await manager.save(Borrowing, {
        dateBorrowed: now,
        userId: user.id,
        bookId: book.id
      });

      book.stock -= 1;
      await manager.save(Book, { id: book.id, stock: book.stock });

      return borrowing;
    });

    return this.getBorrowingDto(actor, borrowing.id);
  }

  async getBorrowing(user: User, id: number) {
    const qb = this.getQueryBuilder(user);

    const borrowing = await qb.andWhere('borrowing.id = :id', {id}).getOne();

    if (!borrowing) {
      throw new NotFoundException('Borrowing not found');
    }

    console.log(borrowing);
    return borrowing;
  }

  async getBorrowingDto(user: User, id: number) {
    return GetBorrowingListItemDto.toDto(await this.getBorrowing(user, id));
  }

  private getQueryBuilder(user: User) {
    const qb = this.dataSource
      .getRepository(Borrowing)
      .createQueryBuilder('borrowing')
      .leftJoinAndSelect('borrowing.user', 'user')
      .leftJoinAndSelect('borrowing.book', 'book');

    switch (user.role) {
      case Role.admin:
        break;
      case Role.manager:
        break;
      case Role.user:
        qb.andWhere('borrowing.userId = :userId', { userId: user.id });
        break;
    }

    return qb;
  }

  async listBorrowingsDto(user: User, dto: PaginationDto) {
    const qb = this.getQueryBuilder(user);
    return paginate(qb, b => GetBorrowingListItemDto.toDto(b), dto);
  }

  async returnBorrowedDto(actor: User, dto: ReturnBorrowedDto) {
    const { userId, bookId } = dto;
    const user = await this.userService.findById(userId);

    const borrowing = await this.dataSource.transaction(async manager => {
      const book = await this.bookService.findById(bookId, manager);
      const borrowing = await manager.findOne(Borrowing, {
        where: {
          userId: user.id,
          bookId,
          isReturned: false
        }
      });

      if (!borrowing) {
        throw new NotFoundException('The book is not borrowed');
      }

      borrowing.isReturned = true;
      book.stock += 1;

      await manager.save(borrowing);
      await manager.save(book);

      return borrowing;
    });

    return this.getBorrowingDto(actor, borrowing.id);
  }
}
