import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('product_categories')
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    deleted_at: string

    @Column()
    created_at: string

    @Column()
    updated_at: string

    @OneToMany(type => Product, product => product.category)
    products: Product[]
}