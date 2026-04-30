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
import { User, UserDocument } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel(Achievement.name)
    private readonly achievementCollection: Model<AchievementDocument>,
    @InjectModel(User.name)
    private readonly userCollection: Model<UserDocument>,
  ) {}

  async createAchievement(body: CreateAchievement) {
    try {
      const scopedUserId = await this.resolveValidatedUserId(body.user_id);

      const achievementDate = new Date(body.achievement_date);
      await this.ensureAchievementDoesNotExist({
        user_id: scopedUserId,
        title: body.title,
        competition_name: body.competition_name,
        achievement_date: achievementDate,
      });

      const achievement = await this.achievementCollection.create({
        user_id: scopedUserId,
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

  async getAllAchievements(userId: string) {
    try {
      const scopedUserId = await this.resolveValidatedUserId(userId);
      const achievements = await this.achievementCollection
        .find({ user_id: scopedUserId })
        .sort({ achievement_date: -1 });

      return {
        success: true,
        data: achievements,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch achievements');
    }
  }

  async searchAchievements(
    userId: string,
    query: {
      title?: string;
      competition_name?: string;
      position?: string;
    },
  ) {
    try {
      const title = query.title?.trim();
      const competitionName = query.competition_name?.trim();
      const position = query.position?.trim();
      const scopedUserId = await this.resolveValidatedUserId(userId);

      if (!title && !competitionName && !position) {
        throw new AchievementSearchQueryRequiredException();
      }

      const filters: Record<string, unknown> = {
        user_id: scopedUserId,
      };

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

  async getAchievementById(id: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidAchievementIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const achievement = await this.achievementCollection.findOne({
        _id: id,
        user_id: scopedUserId,
      });

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

  async updateAchievement(id: string, userId: string, body: UpdateAchievement) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidAchievementIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const achievement = await this.achievementCollection.findOne({
        _id: id,
        user_id: scopedUserId,
      });

      if (!achievement) {
        throw new AchievementNotFoundException();
      }

      const nextAchievementDate =
        body.achievement_date !== undefined
          ? new Date(body.achievement_date)
          : achievement.achievement_date;
      const nextTitle = body.title ?? achievement.title;
      const nextCompetitionName =
        body.competition_name ?? achievement.competition_name;

      await this.ensureAchievementDoesNotExist({
        user_id: scopedUserId,
        title: nextTitle,
        competition_name: nextCompetitionName,
        achievement_date: nextAchievementDate,
        excludeId: achievement._id.toString(),
      });

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

  async deleteAchievement(id: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidAchievementIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const deleted = await this.achievementCollection.findOneAndDelete({
        _id: id,
        user_id: scopedUserId,
      });

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

  private async resolveValidatedUserId(
    userId: string,
  ): Promise<Types.ObjectId> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new InvalidAchievementUserIdException();
    }

    const scopedUserId = new Types.ObjectId(userId);
    await this.ensureUserExists(scopedUserId);

    return scopedUserId;
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

    if (
      existingAchievement &&
      existingAchievement._id.toString() !== input.excludeId
    ) {
      throw new AchievementAlreadyExistsException();
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
