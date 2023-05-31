import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

const entity = require('../../entities/export-entity')

@Module({
    imports: [
        TypeOrmModule.forFeature(entity)
    ],
    controllers: [ProductsController],
    providers: [ProductsService]
})
export class ProductsModule {}