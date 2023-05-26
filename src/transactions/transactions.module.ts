import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";

const entities = require('../entities/export-entity')

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule { }