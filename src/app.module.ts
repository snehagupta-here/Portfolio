import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './common/db/db.module';
import { validateEnv } from './config';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { SuccessResponseInterceptor } from './interceptors/success-response.interceptor';
import { RequestContextMiddleware } from './middleware/request-context.middleware';
import { CloudinaryModule } from './services/cloudinary/cloudinary.module';
import { UserModule } from './modules/user/user.module';
import { SkillModule } from './modules/skill/skill.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { AchievementModule } from './modules/achievement/achievement.module';
import { TestimonialModule } from './modules/testimonial/testimonial.module';
import { BlogModule } from './modules/blog/blog.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    DbModule,
    UserModule,
    SkillModule,
    ExperienceModule,
    AchievementModule,
    TestimonialModule,
    BlogModule,
    ContactUsModule,
    CloudinaryModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
