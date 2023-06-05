import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_galleries')
export class ProductGallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  product_id: number;

  @Column()
  url: string;

  @Column({ name: 'is_primary' })
  is_primary: number;

  @Column()
  deleted_at: string;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

  @ManyToOne((type) => Product, (product) => product.galleries)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
