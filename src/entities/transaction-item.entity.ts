import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./transaction.entity";
import { Product } from "./product.entity";

@Entity('transaction_items')
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  transaction_id: number

  @Column()
  product_id: number

  @Column()
  price: number

  @Column()
  quantity: number

  @Column()
  total_price: number

  @Column()
  created_at: string

  @Column()
  updated_at: string

  @ManyToOne(type => Transaction, transaction => transaction.transaction_items)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction

  @ManyToOne(type => Product)
  @JoinColumn({name: "product_id"})
  product: Product
}