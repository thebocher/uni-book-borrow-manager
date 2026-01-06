import { BaseEntity } from 'src/core/database/base-entity.model';
import { Author } from 'src/modules/authors/models/author.model';
import { Borrowing } from 'src/modules/borrowings/models/borrowing.model';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity('books')
export class Book extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  stock: number;

  // relations
  @ManyToMany(() => Author, (author) => author.books)
  @JoinTable()
  authors: Author[];

  @OneToMany(() => Borrowing, (borrowing) => borrowing.book)
  borrowed: Borrowing[];
}
