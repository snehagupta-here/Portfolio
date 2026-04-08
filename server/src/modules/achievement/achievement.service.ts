import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  AchievementNotFoundException,
  InvalidAchievementIdException,
  InvalidAchievementUserIdException,
} from 'src/exceptions/achievement.exceptions';
import { CreateAchievement, UpdateAchievement } from 'src/interfaces';
import { Achievement } from 'src/schema/achievement.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel(Achievement.name)
    private readonly achievementCollection: Model<Achievement>,
  ) {}

  // CREATE
  async createAchievement(body: CreateAchievement) {
    try {
      if (!Types.ObjectId.isValid(body.user_id)) {
        throw new InvalidAchievementUserIdException();
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

  // UPDATE
  async updateAchievement(id: string, body: UpdateAchievement) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidAchievementIdException();
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
        throw new AchievementNotFoundException();
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
}
