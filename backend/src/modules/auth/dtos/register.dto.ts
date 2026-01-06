import { IsDefined, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(8)
    @IsDefined()
    username: string;

    @IsString()
    @MinLength(8)
    @IsDefined()
    password: string;
}