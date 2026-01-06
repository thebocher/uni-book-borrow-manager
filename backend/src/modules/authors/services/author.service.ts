import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from '../models/author.model';
import { In, Repository } from 'typeorm';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { GetAuthorDto } from '../dtos/get-author.dto';
import { GetAuthorListItemDto } from '../dtos/get-author-list-item.dto';
import PaginationDto from 'src/common/dtos/pagination';
import { paginate } from 'src/common/paginate';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>
  ) {}

  async create(dto: CreateAuthorDto): Promise<GetAuthorDto> {
    const author = await this.authorRepository.save(dto);
    return this.findByIdDto(author.id);
  }

  async findByIds(uniqueIds: number[]) {
    const authors = await this.authorRepository.find({
      where: { id: In(uniqueIds) }
    });

    if (authors.length !== uniqueIds.length) {
      throw new NotFoundException('Not all authors were found');
    }

    return authors;
  }

  async findById(id: number): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: { books: true }
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  async findByIdDto(id: number): Promise<GetAuthorDto> {
    return GetAuthorDto.toDto(await this.findById(id));
  }

  private getQueryBuilder() {
    const qb = this.authorRepository.createQueryBuilder('author');
    return qb;
  }

  async findAllDto(dto: PaginationDto) {
    const qb = this.getQueryBuilder();
    return paginate(qb, a => GetAuthorListItemDto.toDto(a), dto);
  }

  async findAllFlatDto() {
    const qb = this.getQueryBuilder();
    const authors = await qb.getMany();
    return authors.map(a => GetAuthorListItemDto.toDto(a));
  }

  async deleteById(id: number): Promise<void> {
    const author = await this.findById(id);
    void this.authorRepository.remove(author);
  }

  async updateById(
    id: number,
    dto: Partial<CreateAuthorDto>
  ): Promise<GetAuthorDto> {
    const author = await this.findById(id);
    const updated = this.authorRepository.merge(author, dto);
    const merged = await this.authorRepository.save(updated);
    return this.findByIdDto(merged.id);
  }
}
