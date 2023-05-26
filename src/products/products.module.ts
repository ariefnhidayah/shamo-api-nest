import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { TypeOrmModule } from "@nestjs/typeorm";

const entities = require('../entities/export-entity')

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }