import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY, UseRoles } from '../decorators/roles.decorator';
import { UserService } from 'src/modules/users/services/user.service';
import { Role } from 'src/modules/users/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly userService: UserService) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean>{
    const roles: Role[] = this.reflector.get(ROLES_KEY, context.getHandler());

    if (!roles) return true;

    const userData: {id: number} = context.switchToHttp().getRequest().user;
    const user = await this.userService.findById(userData.id);

    if (!roles.includes(user.role)) return false;

    return true;
  }
}
