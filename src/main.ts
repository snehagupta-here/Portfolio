import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppLogger } from './common/app.logger';
import { AppModule } from './app.module';
import { configDefaults } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(AppLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException({
          message: 'Validation failed',
          error: 'Bad Request',
          details: errors,
        }),
    }),
  );

  app.enableCors({
    methods: 'GET,POST,PUT,PATCH,DELETE',
    origin: '*',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT', configDefaults.app.port));
}
bootstrap();
