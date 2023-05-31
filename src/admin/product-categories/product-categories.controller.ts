import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProductCategoriesService } from "./product-categories.service";
import { AdminGuard } from "src/admin.guard";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { ResponseApi } from "src/response-api";
import { GetCategoryDto } from "./dto/get-category.dto";

@ApiBearerAuth()
@ApiTags('admin/product-categories')
@Controller('admin/product-categories')
export class ProductCategoriesController {
    constructor(
        private readonly productCategoriesService: ProductCategoriesService
    ) { }

    @ApiOperation({ summary: "Create Category" })
    @Post('/')
    @UseGuards(AdminGuard)
    async add(@Request() req, @Body() createCategoryDto: CreateCategoryDto): Promise<ResponseApi> {
        return await this.productCategoriesService.add(req, createCategoryDto)
    }

    @ApiOperation({ summary: "Get Category" })
    @Get('/')
    @UseGuards(AdminGuard)
    async get(@Request() req, @Query() getCategoryDto: GetCategoryDto): Promise<ResponseApi> {
        return await this.productCategoriesService.get(req, getCategoryDto)
    }

    @ApiOperation({ summary: "Update Category" })
    @Put('/:id')
    @UseGuards(AdminGuard)
    async update(@Request() req, @Param('id') id: number, @Body() createCategoryDto: CreateCategoryDto): Promise<ResponseApi> {
        return await this.productCategoriesService.update(req, id, createCategoryDto)
    }
}