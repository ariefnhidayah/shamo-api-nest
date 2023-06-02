import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductCategoriesController } from "./product-categories.controller";
import { ProductCategoriesService } from "./product-categories.service";
import { DateLibModule } from "@app/date-lib";

const entities = require('../../entities/export-entity')

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    DateLibModule,
  ],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService]
})
export class ProductCategoriesModule { }