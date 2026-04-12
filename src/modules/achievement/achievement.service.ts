import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AchievementAlreadyExistsException,
  AchievementNotFoundException,
  AchievementSearchQueryRequiredException,
  AchievementUserNotFoundException,
  InvalidAchievementIdException,
  InvalidAchievementUserIdException,
} from 'src/exceptions/achievement.exceptions';
import { CreateAchievement, UpdateAchievement } from 'src/interfaces';
import {
  Achievement,
  AchievementDocument,
} from 'src/schema/achievement.schema';
import { User } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel(Achievement.name)
    private readonly achievementCollection: Model<AchievementDocument>,
    @InjectModel(User.name)
    private readonly userCollection: Model<User>,
  ) {}

  async createAchievement(body: CreateAchievement) {
    try {
      if (!Types.ObjectId.isValid(body.user_id)) {
        throw new InvalidAchievementUserIdException();
      }

      const userId = new Types.ObjectId(body.user_id);
      await this.ensureUserExists(userId);

      const achievementDate = new Date(body.achievement_date);
      await this.ensureAchievementDoesNotExist({
        user_id: userId,
        title: body.title,
        competition_name: body.competition_name,
        achievement_date: achievementDate,
      });

      const achievement = await this.achievementCollection.create({
        user_id: userId,
        achievement_date: achievementDate,
        title: body.title,
        position: body.position,
        description: body.description,
        competition_name: body.competition_name,
        images: body.images,
        certificate_url: body.certificate_url,
      });

      return {
        success: true,
        data: achievement,
        message: 'Achievement created successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to create achievement');
    }
  }

  async getAllAchievements() {
    try {
      const achievements = await this.achievementCollection
        .find()
        .sort({ achievement_date: -1 });

      return {
        success: true,
        data: achievements,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch achievements');
    }
  }

  async searchAchievements(query: {
    user_id?: string;
    title?: string;
    competition_name?: string;
    position?: string;
  }) {
    try {
      const userId = query.user_id?.trim();
      const title = query.title?.trim();
      const competitionName = query.competition_name?.trim();
      const position = query.position?.trim();

      if (!userId && !title && !competitionName && !position) {
        throw new AchievementSearchQueryRequiredException();
      }

      const filters: Record<string, unknown> = {};

      if (userId) {
        if (!Types.ObjectId.isValid(userId)) {
          throw new InvalidAchievementUserIdException();
        }

        filters.user_id = new Types.ObjectId(userId);
      }

      if (title) {
        filters.title = {
          $regex: this.escapeRegex(title),
          $options: 'i',
        };
      }

      if (competitionName) {
        filters.competition_name = {
          $regex: this.escapeRegex(competitionName),
          $options: 'i',
        };
      }

      if (position) {
        filters.position = position;
      }

      const achievements = await this.achievementCollection
        .find(filters)
        .sort({ achievement_date: -1 });

      return {
        success: true,
        data: achievements,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to search achievements');
    }
  }

  async getAchievementById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidAchievementIdException();
      }

      const achievement = await this.achievementCollection.findById(id);

      if (!achievement) {
        throw new AchievementNotFoundException();
      }

      return {
        success: true,
        data: achievement,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch achievement');
    }
  }

  async updateAchievement(id: string, body: UpdateAchievement) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidAchievementIdException();
      }

      const achievement = await this.achievementCollection.findById(id);

      if (!achievement) {
        throw new AchievementNotFoundException();
      }

      const nextUserId = await this.resolveUserId(
        body.user_id,
        achievement.user_id,
      );
      const nextAchievementDate =
        body.achievement_date !== undefined
          ? new Date(body.achievement_date)
          : achievement.achievement_date;
      const nextTitle = body.title ?? achievement.title;
      const nextCompetitionName =
        body.competition_name ?? achievement.competition_name;

      await this.ensureAchievementDoesNotExist({
        user_id: nextUserId,
        title: nextTitle,
        competition_name: nextCompetitionName,
        achievement_date: nextAchievementDate,
        excludeId: achievement._id.toString(),
      });

      achievement.user_id = nextUserId;

      if (body.achievement_date !== undefined) {
        achievement.achievement_date = nextAchievementDate;
      }

      if (body.title !== undefined) {
        achievement.title = body.title;
      }

      if (body.position !== undefined) {
        achievement.position = body.position;
      }

      if (body.description !== undefined) {
        achievement.description = body.description;
      }

      if (body.competition_name !== undefined) {
        achievement.competition_name = body.competition_name;
      }

      if (body.images !== undefined) {
        achievement.images = body.images;
      }

      if (body.certificate_url !== undefined) {
        achievement.certificate_url = body.certificate_url;
      }

      await achievement.save();

      return {
        success: true,
        data: achievement,
        message: 'Achievement updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update achievement');
    }
  }

  async deleteAchievement(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidAchievementIdException();
      }

      const deleted = await this.achievementCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new AchievementNotFoundException();
      }

      return {
        success: true,
        message: 'Achievement deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete achievement');
    }
  }

  private async resolveUserId(
    nextUserId: string | undefined,
    currentUserId: Types.ObjectId,
  ): Promise<Types.ObjectId> {
    if (nextUserId === undefined) {
      return currentUserId;
    }

    if (!Types.ObjectId.isValid(nextUserId)) {
      throw new InvalidAchievementUserIdException();
    }

    const userId = new Types.ObjectId(nextUserId);
    await this.ensureUserExists(userId);

    return userId;
  }

  private async ensureUserExists(userId: Types.ObjectId) {
    const user = await this.userCollection.findById(userId);

    if (!user) {
      throw new AchievementUserNotFoundException();
    }
  }

  private async ensureAchievementDoesNotExist(input: {
    user_id: Types.ObjectId;
    title: string;
    competition_name: string;
    achievement_date: Date;
    excludeId?: string;
  }) {
    const existingAchievement = await this.achievementCollection.findOne({
      user_id: input.user_id,
      title: input.title,
      competition_name: input.competition_name,
      achievement_date: input.achievement_date,
    });

    if (existingAchievement && existingAchievement.id !== input.excludeId) {
      throw new AchievementAlreadyExistsException();
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
