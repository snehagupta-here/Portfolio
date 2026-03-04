import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './modules/user/user.module';
import { SkillModule } from './modules/skill/skill.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { AchievementModule } from './modules/achievement/achievement.module';
import { TestimonialModule } from './modules/testimonial/testimonial.module';
import { BlogModule } from './modules/blog/blog.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      connectionName: 'db',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    UserModule,
    SkillModule,
    ExperienceModule,
    AchievementModule,
    TestimonialModule,
    BlogModule,
    ContactUsModule,
  ],
})
export class AppModule {}
