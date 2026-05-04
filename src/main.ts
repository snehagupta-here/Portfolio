import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppLogger } from './common/app.logger';
import { AppModule } from './app.module';
import { configDefaults } from './config';
import { collectValidationMessages } from './utils/validation-error';

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
      exceptionFactory: (errors) => {
        const messages = collectValidationMessages(errors);

        return new BadRequestException({
          message:
            messages.length === 1
              ? messages[0]
              : messages.length > 1
                ? messages
                : 'Validation failed',
          error: 'Bad Request',
        });
      },
    }),
  );

  const configService = app.get(ConfigService);

  app.enableCors({
    methods: 'GET,POST,PUT,PATCH,DELETE',
    origin: configService.get<string>('CLIENT_URL'),
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(configService.get<number>('PORT', configDefaults.app.port));
}
void bootstrap();
