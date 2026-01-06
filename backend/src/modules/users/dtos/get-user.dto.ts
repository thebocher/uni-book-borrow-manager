import { GetBorrowingListItemDto } from 'src/modules/borrowings/dtos/get-borrowing-list-item.dto';
import { User } from '../models/user.model';
import { GetUserListItemDto } from './get-user-list-item.dto';

export class GetUserDto extends GetUserListItemDto {
  passwordHash: string;
  
  borrowings: GetBorrowingListItemDto[]

  static toDto(entity: User): GetUserDto {
    return {
      ...GetUserListItemDto.toDto(entity),
      passwordHash: entity.passwordHash,
      borrowings: (entity.borrowings ?? []).map(b => GetBorrowingListItemDto.toDto(b))
    };
  }
}
