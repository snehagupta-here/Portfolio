import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Experience } from 'src/schema/experience.schema';
import { handleError } from 'src/utils/error-handler';
import { CreateExperience, UpdateExperience } from 'src/interfaces';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name, 'db')
    private readonly experienceCollection: Model<Experience>,
  ) {}

  // CREATE
  async createExperience(body: CreateExperience) {
    try {
      if (!Types.ObjectId.isValid(body.user_id)) {
        throw new BadRequestException('Invalid user_id');
      }

      const experience = await this.experienceCollection.create({
        ...body,
        user_id: new Types.ObjectId(body.user_id),
        start_date: new Date(body.start_date),
        end_date: body.end_date ? new Date(body.end_date) : null,
      });

      return {
        success: true,
        data: experience,
        message: 'Experience created successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to create experience');
    }
  }

  // GET ALL
  async getAllExperiences() {
    try {
      const experiences = await this.experienceCollection
        .find()
        .sort({ start_date: -1 });

      return {
        success: true,
        data: experiences,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch experiences');
    }
  }

  // GET BY ID
  async getExperienceById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid experience ID');
      }

      const experience = await this.experienceCollection.findById(id);

      if (!experience) {
        throw new NotFoundException('Experience not found');
      }

      return {
        success: true,
        data: experience,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch experience');
    }
  }

  // UPDATE
  async updateExperience(id: string, body: UpdateExperience) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid experience ID');
      }

      if (body.start_date) {
        body.start_date = new Date(body.start_date) as any;
      }

      if (body.end_date) {
        body.end_date = new Date(body.end_date) as any;
      }

      const updated = await this.experienceCollection.findByIdAndUpdate(
        id,
        body,
        { new: true },
      );

      if (!updated) {
        throw new NotFoundException('Experience not found');
      }

      return {
        success: true,
        data: updated,
        message: 'Experience updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update experience');
    }
  }

  // DELETE
  async deleteExperience(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid experience ID');
      }

      const deleted = await this.experienceCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundException('Experience not found');
      }

      return {
        success: true,
        message: 'Experience deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete experience');
    }
  }
}
