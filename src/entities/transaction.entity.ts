import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TransactionItem } from './transaction-item.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  address: string;

  @Column()
  total_price: number;

  @Column()
  shipping_price: number;

  @Column()
  subtotal: number;

  @Column()
  transaction_status: string;

  @Column()
  payment_status: string;

  @Column()
  payment_proof: string;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

  @ManyToOne((type) => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    (type) => TransactionItem,
    (transactionItem) => transactionItem.transaction,
  )
  transaction_items: TransactionItem[];
}
