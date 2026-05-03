import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/schema/blog.schema';
import { Experience, ExperienceSchema } from 'src/schema/experience.schema';
import { Project, ProjectSchema } from 'src/schema/project.schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Achievement, AchievementSchema } from 'src/schema/achievement.schema';
import { Skill, SkillSchema } from 'src/schema/skill.schema';
import { Testimonial, TestimonialSchema } from 'src/schema/testimonial.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Achievement.name, schema: AchievementSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Experience.name, schema: ExperienceSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Skill.name, schema: SkillSchema },
      { name: Testimonial.name, schema: TestimonialSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
