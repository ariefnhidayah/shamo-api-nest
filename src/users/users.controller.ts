import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { ResponseApi } from 'src/response-api';
import { RegisterDto } from './dto/register.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ResponseApi> {
    return await this.usersService.login(loginDto)
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ResponseApi> {
    return await this.usersService.register(registerDto)
  }

}
