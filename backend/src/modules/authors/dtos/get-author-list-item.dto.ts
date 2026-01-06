import { Author } from "../models/author.model";

export class GetAuthorListItemDto {
  id: number;

  name!: string;

  static toDto(entity: Author): GetAuthorListItemDto {
    return {
      id: entity.id,
      name: entity.name,
    };
  }
}
