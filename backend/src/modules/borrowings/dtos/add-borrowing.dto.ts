import { IsDefined, IsInt, IsNumber, IsPositive } from "class-validator";

export class AddBorrowingDto {
    @IsInt()
    @IsDefined()
    @IsPositive()
    userId: number;

    @IsInt()
    @IsDefined()
    @IsPositive()
    bookId: number;
}