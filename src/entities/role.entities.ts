import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  status: number;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

  @OneToMany((type) => User, (user) => user.role)
  users: User[];
}
