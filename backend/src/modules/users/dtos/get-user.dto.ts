import { User } from '../models/user.model';
import { GetUserListItemDto } from './get-user-list-item.dto';
import { Borrowing } from 'src/modules/borrowings/models/borrowing.model';

class GetUserBorrowingListItemDto {
  id: number;

  dateBorrowed: Date;

  userId: number;

  bookId: number;

  isReturned: boolean;

  static toDto(entity: Borrowing): GetUserBorrowingListItemDto {
    return {
      id: entity.id,
      dateBorrowed: entity.dateBorrowed,
      userId: entity.userId,
      bookId: entity.bookId,
      isReturned: entity.isReturned,
    };
  }
}

export class GetUserDto extends GetUserListItemDto {
  passwordHash: string;
  
  borrowings: GetUserBorrowingListItemDto[]

  static toDto(entity: User): GetUserDto {
    return {
      ...GetUserListItemDto.toDto(entity),
      passwordHash: entity.passwordHash,
      borrowings: (entity.borrowings ?? []).map(b => GetUserBorrowingListItemDto.toDto(b))
    };
  }
}
