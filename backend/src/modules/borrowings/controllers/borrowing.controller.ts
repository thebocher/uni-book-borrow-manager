import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BorrowingService } from '../services/borrowing.service';
import { ReturnBorrowedDto } from '../dtos/return-borrowed.dto';
import { AddBorrowingDto } from '../dtos/add-borrowing.dto';
import PaginationDto from 'src/common/dtos/pagination';
import { UseRoles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/users/enums/role.enum';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { User } from 'src/modules/users/models/user.model';

@Controller('borrowings')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Get()
  async list(@Query() dto: PaginationDto, @ReqUser() user: User) {
    return this.borrowingService.listBorrowingsDto(user, dto);
  }

  @UseRoles(Role.admin, Role.manager)
  @Post('return')
  async returnBorrowed(@Body() dto: ReturnBorrowedDto, @ReqUser() user: User) {
    return this.borrowingService.returnBorrowedDto(user, dto);
  }

  @UseRoles(Role.admin, Role.manager)
  @Post('add')
  async addBorrowing(@Body() dto: AddBorrowingDto, @ReqUser() user: User) {
    return this.borrowingService.addBorrowingDto(user, dto);
  }

  @Get(':id')
  async getBorrowing(@Param('id') id: number, @ReqUser() user: User) {
    return this.borrowingService.getBorrowingDto(user, id);
  }
}
