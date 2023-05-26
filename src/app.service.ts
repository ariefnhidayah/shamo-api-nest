import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseApi } from './response-api';

@Injectable()
export class AppService {
  getHello(): ResponseApi {
    const response = new ResponseApi()
    response.success = false
    response.message = "Forbidden!"
    
    throw new HttpException(response, HttpStatus.FORBIDDEN);

  }
}
