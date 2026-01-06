import { Author } from "../models/author.model";
import { GetAuthorListItemDto } from "./get-author-list-item.dto";
import { GetBookListItemDto } from "src/modules/books/dtos/get-book-list-item.dto";

export class GetAuthorDto extends GetAuthorListItemDto {
  bio!: string;
  
  books!: GetBookListItemDto[]

  static toDto(entity: Author): GetAuthorDto {
    const data = GetAuthorListItemDto.toDto(entity);

    return {
      ...data,
      bio: entity.bio,
      books: entity.books.map(b => GetBookListItemDto.toDto(b))
    };
  }
}
