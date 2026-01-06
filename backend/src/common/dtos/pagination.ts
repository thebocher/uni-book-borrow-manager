import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsPositive } from "class-validator";

export default class PaginationDto {
    @Optional()
    @IsPositive()
    @Type(() => Number)
    limit: number = 10;

    @Optional()
    @IsPositive()
    @Type(() => Number)
    page: number = 1;
}