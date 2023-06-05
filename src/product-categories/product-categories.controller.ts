import { Controller, Get, Query } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { GetProductCategoriesDto } from './dto/get-product-categories.dto';
import { ResponseApi } from 'src/response-api';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('product-categories')
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Get()
  async gets(
    @Query() getProductCategoriesDto: GetProductCategoriesDto,
  ): Promise<ResponseApi> {
    return this.productCategoriesService.gets(getProductCategoriesDto);
  }
}
