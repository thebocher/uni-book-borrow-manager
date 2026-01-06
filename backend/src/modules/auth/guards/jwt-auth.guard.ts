import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { ALLOW_UNAUTHORIZED } from "src/common/decorators/allow-unauthorized.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const unauthorizedAllowed = this.reflector.get(ALLOW_UNAUTHORIZED, context.getHandler())

        if (unauthorizedAllowed) return true;

        return super.canActivate(context);
    }
}