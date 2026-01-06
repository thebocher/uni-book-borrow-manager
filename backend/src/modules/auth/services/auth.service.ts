import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/jwt-payload';
import RequestTokenDto from '../dtos/request-token.dto';
import { ResponseTokenDto } from '../dtos/response-token.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyPassword(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsernameOrNull(username);
    if (user && (await this.verifyPassword(password, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async login(dto: RequestTokenDto): Promise<ResponseTokenDto> {
    const {username, password} = dto;
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new ForbiddenException('Invalid password');
    }

    const payload = { username: user.username, sub: user.id } as JwtPayload;

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}
