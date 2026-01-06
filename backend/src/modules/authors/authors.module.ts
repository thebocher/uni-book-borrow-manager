import { Module } from '@nestjs/common';
import { Author } from './models/author.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorController } from './controllers/author.controller';
import { AuthorService } from './services/author.service';

@Module({
    providers: [AuthorService],
    controllers: [AuthorController],
    imports: [TypeOrmModule.forFeature([Author])],
    exports: [AuthorService, TypeOrmModule],
})
export class AuthorsModule {}
