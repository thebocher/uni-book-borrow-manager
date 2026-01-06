import { IsDefined, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsDefined()
  @MinLength(8)
  username: string;

  @IsString()
  @MinLength(8)
  @IsDefined()
  password: string;

  @IsString()
  @IsEnum(Role)
  role: Role;
}
