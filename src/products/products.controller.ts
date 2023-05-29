import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { GetProductsDto } from "./dto/get-products.dto";
import { ResponseApi } from "src/response-api";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get('/')
    async gets(@Query() getProductsDto: GetProductsDto): Promise<ResponseApi> {
        return await this.productsService.gets(getProductsDto)
    }

    @Get('/:id')
    async get(@Param('id') id: number): Promise<ResponseApi> {
        return await this.productsService.get(id)
    }

}