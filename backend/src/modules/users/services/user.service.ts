import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.model';
import { Not, Repository } from 'typeorm';
import { GetUserDto } from '../dtos/get-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { GetUserListItemDto } from '../dtos/get-user-list-item.dto';
import PaginationDto from 'src/common/dtos/pagination';
import { paginate } from 'src/common/paginate';
import { Role } from '../enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = (await bcrypt.hash(password, 12)) as string;
    return hashedPassword;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { borrowings: true }
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByIdOrNull(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async findByIdDto(id: number): Promise<GetUserDto> {
    const user = await this.findById(id);
    return GetUserDto.toDto(user);
  }

  async findByUsernameOrNull(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }
  private getQueryBuilder() {
    const qb = this.userRepository.createQueryBuilder('user');
    return qb;
  }

  async findAllDto(dto: PaginationDto) {
    const qb = this.getQueryBuilder();
    return paginate(qb, u => GetUserListItemDto.toDto(u), dto);
  }

  async findAllFlat() {
    const users = await this.getQueryBuilder().where('1=1').getMany();
    return users.map(u => GetUserListItemDto.toDto(u));
  }

  async create(dto: CreateUserDto): Promise<GetUserDto> {
    const { username, password } = dto;

    if (await this.userRepository.existsBy({ username })) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await this.userRepository.save({
      username,
      passwordHash: hashedPassword,
      role: dto.role
    });

    return this.findByIdDto(user.id);
  }

  async update(id: number, dto: UpdateUserDto): Promise<GetUserDto> {
    const user = await this.findById(id);

    if (
      await this.userRepository.existsBy({
        username: dto.username,
        id: Not(id)
      })
    ) {
      throw new BadRequestException('Username already exists');
    }

    if (dto.username) {
      user.username = dto.username;
    }

    if (dto.password) {
      user.passwordHash = await this.hashPassword(dto.password);
    }

    if (dto.role) {
      user.role = dto.role;
    }

    const updated = await this.userRepository.save(user);
    return this.findByIdDto(updated.id);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  async changePassword(
    actor: User,
    id: number,
    password: string,
    newPassword: string
  ): Promise<void> {
    if (actor.id !== id && actor.role !== Role.admin) {
      throw new ForbiddenException('You can change only your password')
    } 

    const user = await this.findById(id);

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw new ForbiddenException('Current password is incorrect');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    user.passwordHash = hashedPassword;
    await this.userRepository.save(user);
  }
}
