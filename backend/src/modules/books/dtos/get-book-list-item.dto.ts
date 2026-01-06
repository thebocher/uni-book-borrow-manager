import { Book } from '../models/book.model';

export class GetBookListItemDto {
  id: number;

  title: string;

  stock: number;

  static toDto(entity: Book): GetBookListItemDto {
    return {
      id: entity.id,
      title: entity.title,
      stock: entity.stock,
    };
  }
}
