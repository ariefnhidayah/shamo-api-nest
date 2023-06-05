import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { ResponseApi } from 'src/response-api';

@ApiTags('admin/authentication')
@Controller('admin/authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Operation Success',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<ResponseApi> {
    return await this.authenticationService.login(loginDto);
  }
}
