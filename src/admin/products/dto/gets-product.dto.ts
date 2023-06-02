import { ApiProperty } from "@nestjs/swagger"

export class GetsProductDto {
  @ApiProperty({ required: false })
  public page: number

  @ApiProperty({ required: false })
  public limit: number

  @ApiProperty({ required: false })
  public q: string

  @ApiProperty({ required: false })
  public category_id: number
}