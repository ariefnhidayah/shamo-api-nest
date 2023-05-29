import { ApiProperty } from "@nestjs/swagger"

export class GetProductsDto {
    @ApiProperty({ required: false })
    public order_by: string

    @ApiProperty({ required: false })
    public category_id: string

    @ApiProperty({ required: false })
    public limit: string
}