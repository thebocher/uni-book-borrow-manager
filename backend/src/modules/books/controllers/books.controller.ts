import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { CreateBookDto } from '../dtos/create-book.dto';
import { GetBookDto } from '../dtos/get-book.dto';
import PaginationDto from 'src/common/dtos/pagination';
import { UseRoles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/users/enums/role.enum';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  listBooks(@Query() dto: PaginationDto) {
    return this.bookService.list(dto);
  }

  @UseRoles(Role.admin, Role.manager)
  @Get('flat')
  listBooksFlat() {
    return this.bookService.listFlat();
  }

  @Get(':id')
  getBook(@Param('id') id: number): Promise<GetBookDto> {
    return this.bookService.findByIdDto(id);
  }

  @UseRoles(Role.admin)
  @Post()
  createBook(@Body() dto: CreateBookDto): Promise<GetBookDto> {
    return this.bookService.create(dto);
  }

  @UseRoles(Role.admin)
  @Put(':id')
  updateBook(
    @Param('id') id: number,
    @Body() dto: CreateBookDto,
  ): Promise<GetBookDto> {
    return this.bookService.updateDto(id, dto);
  }

  @UseRoles(Role.admin)
  @Patch(':id')
  partialUpdateBook(
    @Param('id') id: number,
    @Body() dto: Partial<CreateBookDto>,
  ): Promise<GetBookDto> {
    return this.bookService.updateDto(id, dto);
  }

  @UseRoles(Role.admin)
  @Delete(':id')
  deleteBook(@Param('id') id: number): Promise<void> {
    return this.bookService.delete(id);
  }
}
