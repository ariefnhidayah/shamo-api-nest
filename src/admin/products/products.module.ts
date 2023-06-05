import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { DateLibModule } from '@app/date-lib';

const entity = require('../../entities/export-entity');

@Module({
  imports: [TypeOrmModule.forFeature(entity), DateLibModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
