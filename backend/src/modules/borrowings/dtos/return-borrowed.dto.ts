import { IsDefined, IsInt, IsPositive } from "class-validator";

export class ReturnBorrowedDto {
  @IsInt()
  @IsDefined()
  userId: number;

  @IsInt()
  @IsDefined()
  bookId: number;
}
