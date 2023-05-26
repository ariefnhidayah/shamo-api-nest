import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductCategory } from "./product-category.entity";
import { ProductGallery } from "./product-gallery.entity";
import { TransactionItem } from "./transaction-item.entity";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    price: number

    @Column()
    description: string

    @Column()
    tags: string

    @Column({ name: 'category_id' })
    category_id: number

    @Column()
    viewed: number

    @Column()
    deleted_at: string

    @Column()
    created_at: string

    @Column()
    updated_at: string

    @ManyToOne(type => ProductCategory, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: ProductCategory

    @OneToMany(type => ProductGallery, gallery => gallery.product)
    galleries: Product[]

    @OneToMany(type => TransactionItem, transactionItem => transactionItem.product)
    transaction_items: TransactionItem[]
}