import { IsDefined, IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @IsString()
  @IsDefined()
  @MinLength(8)
  password: string;

  @IsString()
  @IsDefined()
  @MinLength(8)
  newPassword: string;
}
