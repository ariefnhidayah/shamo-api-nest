import { ApiProperty } from "@nestjs/swagger";

export class ChangePaymentStatusDto {
  @ApiProperty()
  public payment_status: string
}