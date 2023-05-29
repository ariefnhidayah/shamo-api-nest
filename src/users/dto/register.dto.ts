import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty()
    public name: string;

    @ApiProperty()
    public email: string;

    @ApiProperty()
    public password: string;
}