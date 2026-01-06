import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { User } from './models/user.model';
import { UserService } from './services/user.service';

@Module({
    providers: [UserService],
    controllers: [UserController],
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UserService, TypeOrmModule],
})
export class UsersModule {}
