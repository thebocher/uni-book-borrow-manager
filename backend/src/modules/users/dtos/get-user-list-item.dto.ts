import { Role } from '../enums/role.enum';
import { User } from '../models/user.model';

export class GetUserListItemDto {
  id: number;

  username: string;

  role: Role;

  static toDto(entity: User): GetUserListItemDto {
    return {
      id: entity.id,
      username: entity.username,
      role: entity.role,
    };
  }
}
