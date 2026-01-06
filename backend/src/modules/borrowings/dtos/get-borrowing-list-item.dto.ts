import { Borrowing } from '../models/borrowing.model';

export class GetBorrowingListItemDto {
  id: number;

  dateBorrowed: Date;

  userName: string;

  bookTitle: string;

  isReturned: boolean;

  static toDto(entity: Borrowing): GetBorrowingListItemDto {
    return {
      id: entity.id,
      dateBorrowed: entity.dateBorrowed,
      userName: entity.user.username,
      bookTitle: entity.book.title,
      isReturned: entity.isReturned,
    };
  }
}
