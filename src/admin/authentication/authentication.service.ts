import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { ResponseApi } from 'src/response-api';
import * as bcrypt from 'bcrypt';
const Validator = require('fastest-validator');

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ResponseApi> {
    const response = new ResponseApi();

    const validator = new Validator();
    const schema = {
      email: 'email|empty:false',
      password: 'string|min:6',
    };

    const validate = validator.validate(loginDto, schema);
    if (validate.length > 0) {
      throw new HttpException(validate, HttpStatus.BAD_REQUEST, {
        cause: new Error('Please fill in all fields!'),
      });
    }

    const user: User = await this.userRepository.findOne({
      where: { email: loginDto.email, role_id: 1 },
    });
    if (!user) {
      throw new HttpException(null, HttpStatus.BAD_REQUEST, {
        cause: new Error('Un-registered!'),
      });
    }

    const isValidPassword: boolean = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new HttpException(null, HttpStatus.BAD_REQUEST, {
        cause: new Error('Wrong password!'),
      });
    }

    const token = await this.jwtService.signAsync({ data: user });

    response.success = true;
    response.data = {
      access_token: token,
      token_type: 'Bearer',
      data: user,
    };

    return response;
  }
}
