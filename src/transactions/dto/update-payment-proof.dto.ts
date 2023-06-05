import { ApiProperty } from '@nestjs/swagger';

export class UpdatePaymentProofDto {
  @ApiProperty()
  public payment_proof: string;
}
