import { BaseEntity } from 'src/core/database/base-entity.model';
import { Book } from 'src/modules/books/models/book.model';
import { User } from 'src/modules/users/models/user.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('borrowings')
export class Borrowing extends BaseEntity {
  @PrimaryColumn({ type: 'datetime' })
  dateBorrowed: Date;

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  bookId: number;

  @Column({ type: 'boolean', default: false })
  isReturned: boolean;

  // relations

  @ManyToOne(() => User, user => user.borrowings, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  @JoinColumn()
  book: Book;
}
