import { Body, Controller, Get, Post, Request, UseGuards, Query } from "@nestjs/common";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { ResponseApi } from "src/response-api";
import { TransactionsService } from "./transactions.service";
import { AuthGuard } from "src/auth.guard";
import { GetsTransactionDto } from "./dto/gets-transaction.dto";

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService
  ) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async add(@Request() req, @Body() createTransactionDto: CreateTransactionDto): Promise<ResponseApi> {
    return await this.transactionsService.add(req, createTransactionDto)
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async gets(@Request() req, @Query() getsTransactionDto: GetsTransactionDto): Promise<ResponseApi> {
    return await this.transactionsService.gets(req, getsTransactionDto)
  }
}