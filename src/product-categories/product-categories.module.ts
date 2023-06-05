import { Module } from '@nestjs/common';
import { ProductCategoriesController } from './product-categories.controller';
import { ProductCategoriesService } from './product-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';

const entities = require('../entities/export-entity');

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
})
export class ProductCategoriesModule {}
