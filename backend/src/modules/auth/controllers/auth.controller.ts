import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import RequestTokenDto from "../dtos/request-token.dto";
import { AllowUnauthorized } from "src/common/decorators/allow-unauthorized.decorator";
import { UserService } from "src/modules/users/services/user.service";
import { RegisterDto } from "../dtos/register.dto";
import { Role } from "src/modules/users/enums/role.enum";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

    @AllowUnauthorized()
    @Post('login')
    async getToken(@Body() dto: RequestTokenDto ) {
        return this.authService.login(dto);
    }

    @AllowUnauthorized()
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const userDto = {
            username: dto.username,
            password: dto.password,
            role: Role.user,
        }
        return this.userService.create(userDto);
    }
}