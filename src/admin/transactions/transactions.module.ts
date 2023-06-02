import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
const entity = require('../../entities/export-entity')
@Module({
  imports: [
    TypeOrmModule.forFeature(entity),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule { }