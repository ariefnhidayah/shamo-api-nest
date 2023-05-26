import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));
  app.enableCors(); 
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT);
}
bootstrap();
