import { BaseEntity } from 'src/core/database/base-entity.model';
import { Book } from 'src/modules/books/models/book.model';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('authors')
export class Author extends BaseEntity {
  @Column()
  name: string;

  @Column()
  bio: string;

  // relations

  @ManyToMany(() => Book, (book) => book.authors)
  books: Book[];
}
