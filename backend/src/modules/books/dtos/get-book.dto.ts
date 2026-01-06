import { GetAuthorListItemDto } from 'src/modules/authors/dtos/get-author-list-item.dto';
import { Book } from '../models/book.model';
import { GetBookListItemDto } from './get-book-list-item.dto';
import { Borrowing } from 'src/modules/borrowings/models/borrowing.model';

class GetBookBorrowingListItemDto {
  id: number;

  dateBorrowed: Date;

  userId: number;

  bookId: number;

  isReturned: boolean;

  static toDto(entity: Borrowing): GetBookBorrowingListItemDto {
    return {
      id: entity.id,
      dateBorrowed: entity.dateBorrowed,
      userId: entity.userId,
      bookId: entity.bookId,
      isReturned: entity.isReturned,
    };
  }
}

export class GetBookDto extends GetBookListItemDto {
  description: string;

  authors: GetAuthorListItemDto[];

  borrowed: GetBookBorrowingListItemDto[]

  static toDto(entity: Book): GetBookDto {
    return {
      ...GetBookListItemDto.toDto(entity),
      description: entity.description,
      authors: entity.authors.map(a => GetAuthorListItemDto.toDto(a)),
      borrowed: entity.borrowed.map(b => GetBookBorrowingListItemDto.toDto(b)),
    };
  }
}
