import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  public email: string;

  @ApiProperty()
  public password: string;
}
