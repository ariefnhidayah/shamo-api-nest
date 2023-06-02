import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { AdminGuard } from "src/admin.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateProductDto } from "./dto/create-product.dto";
import { ResponseApi } from "src/response-api";
import { GetsProductDto } from "./dto/gets-product.dto";

@ApiBearerAuth()
@ApiTags("admin/products")
@Controller("admin/products")
export class ProductsController {
  constructor(
    private productsService: ProductsService
  ) {}

  @ApiOperation({summary: "Gets Product"})
  @Get('/')
  @UseGuards(AdminGuard)
  async gets(@Request() req, @Query() getsProductDto: GetsProductDto): Promise<ResponseApi> {
    return await this.productsService.gets(req, getsProductDto)
  }

  @ApiOperation({ summary: "Get Product" })
  @Get('/:id')
  @UseGuards(AdminGuard)
  async get(@Request() req, @Param('id') id: number): Promise<ResponseApi> {
    return await this.productsService.get(req, id)
  }

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

  @ApiOperation({summary: "Delete Product"})
  @Delete('/:id')
  @UseGuards(AdminGuard)
  async delete(@Request() req, @Param('id') id: number): Promise<ResponseApi> {
    return await this.productsService.delete(req, id)
  }
}