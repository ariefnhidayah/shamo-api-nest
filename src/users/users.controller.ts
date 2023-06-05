import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { ResponseApi } from 'src/response-api';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: 200,
    description: 'Operation Successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<ResponseApi> {
    return await this.usersService.login(loginDto);
  }

  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({
    status: 201,
    description: 'Operation Successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ResponseApi> {
    return await this.usersService.register(registerDto);
  }
}
