import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { DateLibModule } from "@app/date-lib";
const entity = require('../../entities/export-entity')
@Module({
  imports: [
    TypeOrmModule.forFeature(entity),
    DateLibModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule { }