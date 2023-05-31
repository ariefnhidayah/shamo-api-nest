import { ApiProperty } from "@nestjs/swagger"

export class ProductGalleryDto {
  @ApiProperty()
  public url: string

  @ApiProperty()
  public is_primary: number
}