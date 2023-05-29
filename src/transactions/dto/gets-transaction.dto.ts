import { ApiProperty } from "@nestjs/swagger"

export class GetsTransactionDto {
  @ApiProperty({ required: false })
  public page: number

  @ApiProperty({ required: false })
  public limit: number

  @ApiProperty({ required: false, enum: ['pending', 'processed', 'sent', 'finished'] })
  public transaction_status: string

  @ApiProperty({ required: false, enum: ['pending', 'paid', 'failed', 'expired'] })
  public payment_status: string
}