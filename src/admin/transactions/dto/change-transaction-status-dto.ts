import { ApiProperty } from '@nestjs/swagger';

export class ChangeTransactionStatusDto {
  @ApiProperty()
  public transaction_status: string;
}
