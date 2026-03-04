import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Achievement } from 'src/schema/achievement.schema';
import { handleError } from 'src/utils/error-handler';
import { CreateAchievement, UpdateAchievement } from 'src/interfaces';

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel(Achievement.name, 'db')
    private readonly achievementCollection: Model<Achievement>,
  ) {}

  // CREATE
  async createAchievement(body: CreateAchievement) {
    try {
      if (!Types.ObjectId.isValid(body.user_id)) {
        throw new BadRequestException('Invalid user_id');
      }

      const achievement = await this.achievementCollection.create({
        ...body,
        user_id: new Types.ObjectId(body.user_id),
        achievement_date: new Date(body.achievement_date),
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

  // GET ALL
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

  // GET BY ID
  async getAchievementById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid achievement ID');
      }

      const achievement = await this.achievementCollection.findById(id);

      if (!achievement) {
        throw new NotFoundException('Achievement not found');
      }

      return {
        success: true,
        data: achievement,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch achievement');
    }
  }

  // UPDATE
  async updateAchievement(id: string, body: UpdateAchievement) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid achievement ID');
      }

      if (body.achievement_date) {
        body.achievement_date = new Date(body.achievement_date) as any;
      }

      const updated = await this.achievementCollection.findByIdAndUpdate(
        id,
        body,
        { new: true },
      );

      if (!updated) {
        throw new NotFoundException('Achievement not found');
      }

      return {
        success: true,
        data: updated,
        message: 'Achievement updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update achievement');
    }
  }

  // DELETE
  async deleteAchievement(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid achievement ID');
      }

      const deleted = await this.achievementCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundException('Achievement not found');
      }

      return {
        success: true,
        message: 'Achievement deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete achievement');
    }
  }
}
