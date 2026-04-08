import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Experience, ExperienceSchema } from 'src/schema/experience.schema';
import { User, UserSchema } from 'src/schema/user.schema';

import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Experience.name, schema: ExperienceSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ExperienceController],
  providers: [ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}
