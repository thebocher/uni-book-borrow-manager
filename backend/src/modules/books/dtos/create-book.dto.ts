import { ArrayUnique, IsDefined, IsInt, IsNumber, IsPositive, IsString, Min, Validate } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsDefined()
  title: string;

  @IsString()
  @IsDefined()
  description: string;

  @IsNumber()
  @Min(0)
  @IsDefined()
  stock: number;

  @IsDefined({ each: true })
  @IsNumber({}, { each: true })
  @ArrayUnique()
  authorIds: number[];
}
