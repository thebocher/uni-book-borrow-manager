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
import { AuthorService } from '../services/author.service';
import { GetAuthorDto } from '../dtos/get-author.dto';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { GetAuthorListItemDto } from '../dtos/get-author-list-item.dto';
import PaginationDto from 'src/common/dtos/pagination';
import { UseRoles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/users/enums/role.enum';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  async findAll(@Query() dto: PaginationDto) {
    console.log(dto)
    return this.authorService.findAllDto(dto);
  }

  @UseRoles(Role.admin, Role.manager)
  @Get('flat')
  async findAllFlat() {
    return this.authorService.findAllFlatDto();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<GetAuthorDto> {
    return this.authorService.findByIdDto(id);
  }

  @UseRoles(Role.admin)
  @Post()
  async create(@Body() dto: CreateAuthorDto): Promise<GetAuthorDto> {
    return this.authorService.create(dto);
  }

  @UseRoles(Role.admin)
  @Put(':id')
  async updateById(
    @Param('id') id: number,
    @Body() dto: CreateAuthorDto,
  ): Promise<GetAuthorDto> {
    return this.authorService.updateById(id, dto);
  }

  @UseRoles(Role.admin)
  @Patch(':id')
  async partialUpdateById(
    @Param('id') id: number,
    @Body() dto: Partial<CreateAuthorDto>,
  ): Promise<GetAuthorDto> {
    return this.authorService.updateById(id, dto);
  }

  @UseRoles(Role.admin)
  @Delete(':id')
  async deleteById(@Param('id') id: number): Promise<void> {
    return this.authorService.deleteById(id);
  }
}
