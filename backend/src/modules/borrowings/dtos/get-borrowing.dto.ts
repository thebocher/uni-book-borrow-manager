import { GetUserListItemDto } from 'src/modules/users/dtos/get-user-list-item.dto';
import { Borrowing } from '../models/borrowing.model';
import { GetBookListItemDto } from 'src/modules/books/dtos/get-book-list-item.dto';

export class GetBorrowingListItemDto {
  id: number;

  dateBorrowed: Date;

  user: GetUserListItemDto;

  book: GetBookListItemDto;

  isReturned: boolean;

  static toDto(entity: Borrowing): GetBorrowingListItemDto {
    return {
      id: entity.id,
      dateBorrowed: entity.dateBorrowed,
      book: GetBookListItemDto.toDto(entity.book),
      user: GetUserListItemDto.toDto(entity.user),
      isReturned: entity.isReturned,
    };
  }
}
