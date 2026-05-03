import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InvalidBlogUserIdException } from 'src/exceptions';
import { AnalyticsUserNotFoundException } from 'src/exceptions/analytics.exceptions';
import {
  Achievement,
  AchievementDocument,
} from 'src/schema/achievement.schema';
import { Blog, BlogDocument } from 'src/schema/blog.schema';
import { Experience, ExperienceDocument } from 'src/schema/experience.schema';
import { Project, ProjectDocument } from 'src/schema/project.schema';
import { Skill, SkillDocument } from 'src/schema/skill.schema';
import {
  Testimonial,
  TestimonialDocument,
} from 'src/schema/testimonial.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';

type AvgRatingResult = {
  _id: null;
  avgRating: number;
};

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Achievement.name)
    private readonly achievementCollection: Model<AchievementDocument>,

    @InjectModel(Blog.name)
    private readonly blogCollection: Model<BlogDocument>,

    @InjectModel(Experience.name)
    private readonly experienceCollection: Model<ExperienceDocument>,

    @InjectModel(Project.name)
    private readonly projectCollection: Model<ProjectDocument>,

    @InjectModel(Skill.name)
    private readonly skillCollection: Model<SkillDocument>,

    @InjectModel(Testimonial.name)
    private readonly testimonialCollection: Model<TestimonialDocument>,

    @InjectModel(User.name)
    private readonly userCollection: Model<UserDocument>,
  ) {}
  async profileDataCount(userId: string) {
    try {
      const scopedUserId = await this.resolveValidatedUserId(userId);
      const filter = { user_id: scopedUserId };
      const [achievements, blogs, experiences, projects, skills, testimonials] =
        await Promise.all([
          this.achievementCollection.countDocuments(filter),
          this.blogCollection.countDocuments(filter),
          this.experienceCollection.countDocuments(filter),
          this.projectCollection.countDocuments(filter),
          this.skillCollection.countDocuments(),
          this.testimonialCollection.countDocuments(filter),
        ]);

      return {
        achievements,
        blogs,
        experiences,
        projects,
        skills,
        testimonials,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to load data count');
    }
  }

  async insights(userId: string) {
    try {
      const scopedUserId = await this.resolveValidatedUserId(userId);
      const [avgRating, activeBlogs, totalBlogs, totalProjects] =
        await Promise.all([
          this.testimonialCollection.aggregate<AvgRatingResult>([
            { $match: { userId: scopedUserId } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } },
          ]),
          this.blogCollection.countDocuments({
            userId: scopedUserId,
            isActive: true,
          }),
          this.blogCollection.countDocuments({ userId: scopedUserId }),
          this.projectCollection.countDocuments({ userId: scopedUserId }),
        ]);
      return {
        avgRating: avgRating[0]?.avgRating ?? 0,
        activeBlogs,
        totalContent: totalBlogs + totalProjects,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to load insights data');
    }
  }

  async recentData(userId: string) {
    try {
      const scopedUserId = await this.resolveValidatedUserId(userId);
      const filter = { user_id: scopedUserId };
      const [
        recentAchievements,
        recentBlogs,
        recentExperiences,
        recentProjects,
        recentSkills,
        recentTestimonials,
      ] = await Promise.all([
        this.achievementCollection
          .find(filter)
          .sort({ createdAt: -1 })
          .limit(5),
        this.blogCollection.find(filter).sort({ createdAt: -1 }).limit(5),
        this.experienceCollection.find(filter).sort({ createdAt: -1 }).limit(5),
        this.projectCollection.find(filter).sort({ createdAt: -1 }).limit(5),
        this.skillCollection.find().sort({ createdAt: -1 }).limit(5),
        this.testimonialCollection
          .find(filter)
          .sort({ createdAt: -1 })
          .limit(5),
      ]);
      return {
        recentAchievements,
        recentBlogs,
        recentExperiences,
        recentProjects,
        recentSkills,
        recentTestimonials,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to load recent data');
    }
  }
  private async resolveValidatedUserId(
    userId: string,
  ): Promise<Types.ObjectId> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new InvalidBlogUserIdException();
    }

    const scopedUserId = new Types.ObjectId(userId);
    await this.ensureUserExists(scopedUserId);

    return scopedUserId;
  }

  private async ensureUserExists(userId: Types.ObjectId) {
    const user = await this.userCollection.findById(userId);

    if (!user) {
      throw new AnalyticsUserNotFoundException();
    }
  }
}
