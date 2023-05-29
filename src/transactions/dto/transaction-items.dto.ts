import { ApiProperty } from "@nestjs/swagger"

export class TransactionItemsDto {
  @ApiProperty()
  public product_id: number

  @ApiProperty()
  public quantity: number
}