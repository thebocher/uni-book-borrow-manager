import { BaseEntity } from 'src/core/database/base-entity.model';
import { Borrowing } from 'src/modules/borrowings/models/borrowing.model';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: Role, enumName: 'Roles', default: Role.user })
  role: Role;

  // relations
  @OneToMany(() => Borrowing, (borrowing) => borrowing.user)
  borrowings: Borrowing[];
}
