import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from 'src/entities/product-category.entity';
import { Repository } from 'typeorm';
import { GetProductCategoriesDto } from './dto/get-product-categories.dto';
import { ResponseApi } from 'src/response-api';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async gets(
    getProductCategoriesDto: GetProductCategoriesDto,
  ): Promise<ResponseApi> {
    const response = new ResponseApi();

    const categories = await this.productCategoryRepository
      .createQueryBuilder('c')
      .select('c.id')
      .addSelect('c.name')
      .orderBy(
        getProductCategoriesDto.order_by == 'a_z' ||
          getProductCategoriesDto.order_by == 'z_a'
          ? 'name'
          : 'id',
        getProductCategoriesDto.order_by == 'a_z' ? 'ASC' : 'DESC',
      )
      .where('deleted_at is null')
      .getMany();

    response.data = categories;
    response.success = true;

    return response;
  }
}
