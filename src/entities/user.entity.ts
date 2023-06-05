import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Role } from './role.entities';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'role_id' })
  role_id: number;

  @Column()
  profile_photo_path: string;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

  @OneToMany((type) => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @ManyToOne((type) => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
