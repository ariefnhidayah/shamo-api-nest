import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { ResponseApi } from 'src/response-api';
const Validator = require("fastest-validator");
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) { }

  async login(loginDto: LoginDto): Promise<ResponseApi> {
    const response = new ResponseApi()
    const validator = new Validator()
    const schema = {
      email: "email|empty:false",
      password: "string|min:6"
    }

    const validate = validator.validate(loginDto, schema)
    if (validate.length > 0) {
      throw new HttpException(validate, HttpStatus.BAD_REQUEST, { cause: new Error('Please fill in all fields!') })
    }

    const user: User = await this.userRepository.findOne({ where: { email: loginDto.email, role_id: 2 } })
    if (!user) {
      throw new HttpException(null, HttpStatus.BAD_REQUEST, { cause: new Error('Un-registered email!') })
    }

    const isValidPassword: boolean = await bcrypt.compare(loginDto.password, user.password)
    if (!isValidPassword) {
      throw new HttpException(null, HttpStatus.BAD_REQUEST, { cause: new Error('Wrong password!') })
    }

    const token = await this.jwtService.signAsync({ data: user })

    response.success = true
    response.data = {
      access_token: token,
      token_type: "Bearer",
      data: user
    }

    return response
  }

  _getInitialName(fullName): string {
    const results = [];
    const wordArray = fullName.split(' ');

    wordArray.forEach((e, i) => {
      if (i < 2) {
        results.push(e);
      }
    });

    return results.join('+').toUpperCase();
  }

  _getRandomColor(): string {
    const colors = [
      '08ab02',
      '00a1e1',
      'ab0202',
      '7f0084',
      '926900',
      'a70050',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  _generatePhotoProfile(fullName): string {
    const initialName = this._getInitialName(fullName)
    const color = this._getRandomColor()
    return `https://eu.ui-avatars.com/api/?background=${color}&color=fff&size=128&name=${initialName}`
  }

  async register(registerDto: RegisterDto): Promise<ResponseApi> {
    const response = new ResponseApi()
    const validator = new Validator()
    const schema = {
      name: "string|empty:false",
      email: "email|empty:false",
      password: "string|min:6",
    }

    const validate = validator.validate(registerDto, schema)
    if (validate.length > 0) {
      throw new HttpException(validate, HttpStatus.BAD_REQUEST, { cause: new Error('Please fill in all fields!') })
    }

    // check email
    const user = await this.userRepository.findOne({ where: { email: registerDto.email } })
    if (user) {
      throw new HttpException(null, HttpStatus.BAD_REQUEST, { cause: new Error('E-mail has been used!') })
    }

    const password: string = await bcrypt.hash(registerDto.password, 10)
    const profilePhotoPath = this._generatePhotoProfile(registerDto.name)

    const data: Object = {
      name: registerDto.name,
      email: registerDto.email,
      password: password,
      profile_photo_path: profilePhotoPath,
      role_id: 2,
    }

    const newUser = await this.userRepository.save(data)
    const token = await this.jwtService.signAsync({ data: newUser })

    response.success = true
    response.data = {
      access_token: token,
      token_type: 'Bearer',
      data: newUser
    }
    response.message = 'Register Successfully!'

    return response
  }

}
