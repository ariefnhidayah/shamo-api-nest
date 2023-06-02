import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "src/admin.guard";
import { GetsTransactionDto } from "./dto/gets-transaction.dto";
import { ResponseApi } from "src/response-api";

@ApiBearerAuth()
@ApiTags("admin/transactions")
@Controller('admin/transactions')
export class TransactionsController {
  constructor(
    private transactionsService: TransactionsService
  ) { }

  @ApiOperation({ summary: "Gets Transaction" })
  @Get('/')
  @UseGuards(AdminGuard)
  async gets(@Request() req, @Query() getsTransactionDto: GetsTransactionDto): Promise<ResponseApi> {
    return await this.transactionsService.gets(req, getsTransactionDto)
  }

}