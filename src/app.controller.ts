import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseApi } from './response-api';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ResponseApi {
    return this.appService.getHello();
  }
}
