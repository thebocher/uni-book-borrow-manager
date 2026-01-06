import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Book } from '../models/book.model';
import { DataSource, EntityManager } from 'typeorm';
import { CreateBookDto } from '../dtos/create-book.dto';
import { GetBookDto } from '../dtos/get-book.dto';
import { GetBookListItemDto } from '../dtos/get-book-list-item.dto';
import { AuthorService } from 'src/modules/authors/services/author.service';
import { Author } from 'src/modules/authors/models/author.model';
import { paginate } from 'src/common/paginate';
import PaginationDto from 'src/common/dtos/pagination';

@Injectable()
export class BooksService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authorService: AuthorService
  ) {}

  async create(dto: CreateBookDto): Promise<GetBookDto> {
    const authors = await this.authorService.findByIds(dto.authorIds);

    const created = await this.dataSource.manager.save(Book, {
      title: dto.title,
      description: dto.description,
      authors,
      stock: dto.stock
    });
    return this.findByIdDto(created.id);
  }

  private getQueryBuilder() {
    const qb = this.dataSource.getRepository(Book).createQueryBuilder('book');
    return qb;
  }

  async list(dto: PaginationDto) {
    const qb = this.getQueryBuilder();
    return paginate(qb, b => GetBookListItemDto.toDto(b), dto);
  }

  async listFlat() {
    const books = await this.getQueryBuilder().where('1=1').getMany();
    return books.map(b => GetBookListItemDto.toDto(b));
  }

  async findById(id: number, manager?: EntityManager): Promise<Book> {
    manager = manager ?? this.dataSource.manager;
    const book = await manager.findOne(Book, {
      where: { id },
      relations: {
        authors: true,
        borrowed: true
      }
    });

    if (book == null) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async findByIdDto(id: number): Promise<GetBookDto> {
    return GetBookDto.toDto(await this.findById(id));
  }

  async delete(id: number): Promise<void> {
    const book = await this.findById(id);

    if (book.borrowed.filter(b => !b.isReturned).length > 0) {
      throw new BadRequestException('Cannot delete a borrowed book');
    }

    await this.dataSource.manager.remove(book);
  }

  async updateDto(
    id: number,
    dto: Partial<CreateBookDto>
  ): Promise<GetBookDto> {
    const book = await this.findById(id);

    const updated = this.dataSource.manager.merge(Book, book, {
      title: dto.title,
      description: dto.description,
      stock: dto.stock
    });

    if (dto.authorIds != null) {
      const authors = await this.authorService.findByIds(dto.authorIds);
      updated.authors = authors;
    }

    const merged = await this.dataSource.manager.save(updated);

    return this.findByIdDto(merged.id);
  }
}
