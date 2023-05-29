import { Body, Controller, Get, Post, Request, UseGuards, Query, Param, Put } from "@nestjs/common";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { ResponseApi } from "src/response-api";
import { TransactionsService } from "./transactions.service";
import { AuthGuard } from "src/auth.guard";
import { GetsTransactionDto } from "./dto/gets-transaction.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdatePaymentProofDto } from "./dto/update-payment-proof.dto";

@ApiBearerAuth()
@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService
  ) { }

  @ApiOperation({ summary: "Create Transaction" })
  @ApiResponse({
    status: 201,
    description: 'Operation Successfully'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @Post('/')
  @UseGuards(AuthGuard)
  async add(@Request() req, @Body() createTransactionDto: CreateTransactionDto): Promise<ResponseApi> {
    return await this.transactionsService.add(req, createTransactionDto)
  }

  @ApiOperation({ summary: "Get Transactions" })
  @ApiResponse({
    status: 200,
    description: 'Operation Successfully'
  })
  @Get('/')
  @UseGuards(AuthGuard)
  async gets(@Request() req, @Query() getsTransactionDto: GetsTransactionDto): Promise<ResponseApi> {
    return await this.transactionsService.gets(req, getsTransactionDto)
  }

  @ApiOperation({ summary: "Get Detail Transaction" })
  @ApiResponse({
    status: 200,
    description: 'Operation Successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found'
  })
  @Get('/:id')
  @UseGuards(AuthGuard)
  async get(@Request() req, @Param('id') id: number): Promise<ResponseApi> {
    return await this.transactionsService.get(req, id)
  }

  @ApiOperation({ summary: "Update Payment Proof" })
  @ApiResponse({
    status: 200,
    description: 'Operation Successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found'
  })
  @Put('/:id/payment-proof')
  @UseGuards(AuthGuard)
  async updatePaymentProof(@Request() req, @Param('id') id: number, @Body() updatePaymentProofDto: UpdatePaymentProofDto): Promise<ResponseApi> {
    return await this.transactionsService.updatePaymentProof(req, id, updatePaymentProofDto)
  }
}