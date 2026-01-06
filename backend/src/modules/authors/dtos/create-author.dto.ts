import { IsDefined, IsString, MinLength } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsDefined()
  @MinLength(8)
  name!: string;

  @IsString()
  @IsDefined()
  bio!: string;
}