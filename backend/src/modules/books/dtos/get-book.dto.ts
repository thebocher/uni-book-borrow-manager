import { GetAuthorListItemDto } from 'src/modules/authors/dtos/get-author-list-item.dto';
import { Book } from '../models/book.model';
import { GetBookListItemDto } from './get-book-list-item.dto';
import { GetBorrowingListItemDto } from 'src/modules/borrowings/dtos/get-borrowing-list-item.dto';

export class GetBookDto extends GetBookListItemDto {
  description: string;

  authors: GetAuthorListItemDto[];

  borrowed: GetBorrowingListItemDto[]

  static toDto(entity: Book): GetBookDto {
    return {
      ...GetBookListItemDto.toDto(entity),
      description: entity.description,
      authors: entity.authors.map(a => GetAuthorListItemDto.toDto(a)),
      borrowed: entity.borrowed.map(b => GetBorrowingListItemDto.toDto(b)),
    };
  }
}
