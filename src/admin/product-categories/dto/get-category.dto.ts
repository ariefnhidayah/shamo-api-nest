import { ApiProperty } from '@nestjs/swagger';

export class GetCategoryDto {
  @ApiProperty({ required: false })
  public page: number;

  @ApiProperty({ required: false })
  public limit: number;

  @ApiProperty({ required: false })
  public q: string;
}
