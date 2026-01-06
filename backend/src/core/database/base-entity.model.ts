import { Column } from 'typeorm';

export abstract class BaseEntity {
  @Column({ primary: true, generated: 'increment' })
  id: number;
}
