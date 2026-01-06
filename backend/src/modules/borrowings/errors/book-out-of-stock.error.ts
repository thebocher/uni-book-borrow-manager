import { BadRequestException } from "@nestjs/common";

export class BookOutOfStock extends BadRequestException {}
