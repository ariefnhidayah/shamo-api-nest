import { ApiProperty } from '@nestjs/swagger';
import { TransactionItemsDto } from './transaction-items.dto';

export class CreateTransactionDto {
  @ApiProperty()
  public address: string;

  @ApiProperty()
  public shipping_price: number;

  @ApiProperty({
    isArray: true,
    type: TransactionItemsDto,
  })
  public transaction_items: TransactionItemsDto[];
}
