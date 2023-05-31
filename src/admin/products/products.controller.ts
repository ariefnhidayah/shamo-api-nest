import { Body, Controller, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { AdminGuard } from "src/admin.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateProductDto } from "./dto/create-product.dto";
import { ResponseApi } from "src/response-api";

@ApiBearerAuth()
@ApiTags("admin/products")
@Controller("admin/products")
export class ProductsController {
  constructor(
    private productsService: ProductsService
  ) {}

  @ApiOperation({ summary: "Create Product" })
  @Post('/')
  @UseGuards(AdminGuard)
  async add(@Request() req, @Body() createProductDto: CreateProductDto): Promise<ResponseApi> {
    return await this.productsService.add(req, createProductDto)
  }

  @ApiOperation({summary: "Update Product"})
  @Put('/:id')
  @UseGuards(AdminGuard)
  async update(@Request() req, @Param('id') id: number, @Body() createProductDto: CreateProductDto): Promise<ResponseApi> {
    return await this.productsService.update(req, id, createProductDto)
  }
}