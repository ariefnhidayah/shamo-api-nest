import { ApiProperty } from "@nestjs/swagger"
import { ProductGalleryDto } from "./product-gallery.dto"

export class CreateProductDto {
  @ApiProperty()
  public name: string

  @ApiProperty()
  public price: number

  @ApiProperty()
  public description: string

  @ApiProperty()
  public tags: string

  @ApiProperty()
  public category_id: number

  @ApiProperty({
    isArray: true,
    type: ProductGalleryDto,
  })
  public product_galleries: ProductGalleryDto[]
}