import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/admin.guard';
import { GetsTransactionDto } from './dto/gets-transaction.dto';
import { ResponseApi } from 'src/response-api';
import { ChangePaymentStatusDto } from './dto/change-payment-status-dto';
import { ChangeTransactionStatusDto } from './dto/change-transaction-status-dto';

@ApiBearerAuth()
@ApiTags('admin/transactions')
@Controller('admin/transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Gets Transaction' })
  @Get('/')
  @UseGuards(AdminGuard)
  async gets(
    @Request() req,
    @Query() getsTransactionDto: GetsTransactionDto,
  ): Promise<ResponseApi> {
    return await this.transactionsService.gets(req, getsTransactionDto);
  }

  @ApiOperation({ summary: 'Get Detail Transaction' })
  @Get('/:id')
  @UseGuards(AdminGuard)
  async get(@Request() req, @Param('id') id: number) {
    return await this.transactionsService.get(req, id);
  }

  @ApiOperation({ summary: 'Update Payment Status' })
  @Put('/:id/payment-status')
  @UseGuards(AdminGuard)
  async updatePaymentStatus(
    @Request() req,
    @Param('id') id: number,
    @Body() changePaymentStatusDto: ChangePaymentStatusDto,
  ) {
    return await this.transactionsService.changePaymentStatus(
      req,
      id,
      changePaymentStatusDto,
    );
  }

  @ApiOperation({ summary: 'Update Transaction Status' })
  @Put('/:id/transaction-status')
  @UseGuards(AdminGuard)
  async updateTransactionStatus(
    @Request() req,
    @Param('id') id: number,
    @Body() changeTransactionStatusDto: ChangeTransactionStatusDto,
  ) {
    return await this.transactionsService.changeTransactionStatus(
      req,
      id,
      changeTransactionStatusDto,
    );
  }
}
