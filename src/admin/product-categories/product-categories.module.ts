import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductCategoriesController } from "./product-categories.controller";
import { ProductCategoriesService } from "./product-categories.service";

const entities = require('../../entities/export-entity')

@Module({
  imports: [
    TypeOrmModule.forFeature(entities)
  ],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService]
})
export class ProductCategoriesModule { }