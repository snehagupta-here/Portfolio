import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Skill, SkillSchema } from 'src/schema/skill.schema';
import { User, UserSchema } from 'src/schema/user.schema';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Skill.name, schema: SkillSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
