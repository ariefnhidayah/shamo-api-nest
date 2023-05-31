import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/entities/product.entity";
import { Repository } from "typeorm";
import { GetProductsDto } from "./dto/get-products.dto";
import { ResponseApi } from "src/response-api";
import { ProductGallery } from "src/entities/product-gallery.entity";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(ProductGallery) private productGalleryRepository: Repository<ProductGallery>
    ) { }

    async gets(getProductsDto: GetProductsDto): Promise<ResponseApi> {
        const response = new ResponseApi()

        let { category_id, limit, order_by } = getProductsDto

        let products = this.productRepository
            .createQueryBuilder('p')
            .select('p.id')
            .addSelect('p.name')
            .addSelect('p.price')
            .addSelect('p.description')
            .addSelect('p.tags')
            .limit(limit != null ? parseInt(limit) : null)
            .leftJoin('p.category', 'category')
            .addSelect(['category.name'])
            .leftJoin('p.galleries', 'galleries', 'galleries.is_primary = 1')
            .addSelect(['galleries.url'])
            .where('p.deleted_at is null')
            .orderBy(order_by == 'popular' ? 'p.viewed' : 'p.id', 'DESC')

        if (category_id != null && category_id != '') {
            products.andWhere('p.category_id = :category_id', { category_id })
        }

        response.data = await products.getMany()
        response.success = true

        return response
    }

    async get(id: number): Promise<ResponseApi> {
        const response = new ResponseApi()

        const product = await this.productRepository
            .createQueryBuilder('p')
            .select('p.id')
            .addSelect('p.name')
            .addSelect('p.price')
            .addSelect('p.description')
            .addSelect('p.tags')
            .addSelect('p.viewed')
            .leftJoin('p.category', 'category')
            .addSelect(['category.name'])
            .where({ id })
            .andWhere('p.deleted_at is null')
            .getOne()

        if (!product) {
            throw new HttpException(null, HttpStatus.NOT_FOUND, { cause: new Error('Product not found!') })
        }

        const galleries = await this.productGalleryRepository
            .createQueryBuilder('pg')
            .select('pg.url')
            .addSelect('pg.is_primary')
            .where("pg.product_id = :id", { id })
            .orderBy('pg.is_primary', 'DESC')
            .getMany()

        await this.productRepository.update({ id }, {viewed: product.viewed + 1})

        response.data = {
            ...product,
            galleries
        }
        response.success = true

        return response
    }
}