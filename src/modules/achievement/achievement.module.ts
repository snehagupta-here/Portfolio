import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Achievement, AchievementSchema } from 'src/schema/achievement.schema';
import { User, UserSchema } from 'src/schema/user.schema';

import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Achievement.name, schema: AchievementSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [AchievementService],
})
export class AchievementModule {}
