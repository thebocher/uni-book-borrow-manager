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
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import PaginationDto from 'src/common/dtos/pagination';
import { UseRoles } from 'src/common/decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseRoles(Role.admin, Role.manager)
  @Get()
  async getAllUsers(@Query() dto: PaginationDto) {
    return this.userService.findAllDto(dto);
  }
  
  @UseRoles(Role.admin, Role.manager)
  @Get('flat')
  async getAllUsersFlat() {
    return this.userService.findAllFlat();
  }

  @UseRoles(Role.admin, Role.manager)
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.userService.findByIdDto(id);
  }

  @UseRoles(Role.admin)
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseRoles(Role.admin)
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @UseRoles(Role.admin)
  @Patch(':id')
  async partialUpdateUser(@Param('id') id: number, @Body() dto: Partial<UpdateUserDto>) {
    return this.userService.update(id, dto);
  }

  @UseRoles(Role.admin)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.delete(id);
  }

  @Post(':id/change-password')
  async changePassword(
    @Param('id') id: number,
    @Body() body: UpdatePasswordDto,
    @Req() req: any 
  ) {
    const { password, newPassword } = body;
    return this.userService.changePassword(req.user, id, password, newPassword);
  }
}
