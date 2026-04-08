import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  ExperienceAlreadyExistsException,
  ExperienceNotFoundException,
  ExperienceUserNotFoundException,
  InvalidExperienceIdException,
  InvalidExperienceUserIdException,
} from 'src/exceptions/experience.exceptions';
import { ResolvedExperienceInput } from 'src/interfaces';
import { Experience } from 'src/schema/experience.schema';
import { User } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceCollection: Model<Experience>,
    @InjectModel(User.name)
    private readonly userCollection: Model<User>,
  ) {}

  async createExperience(body: ResolvedExperienceInput) {
    try {
      if (!Types.ObjectId.isValid(body.user_id)) {
        throw new InvalidExperienceUserIdException();
      }

      const userId = new Types.ObjectId(body.user_id);
      const existingUser = await this.userCollection.findById(userId);

      if (!existingUser) {
        throw new ExperienceUserNotFoundException();
      }

      const existingExperience = await this.experienceCollection.findOne({
        user_id: userId,
        organization_name: body.organization_name,
        designation: body.designation,
        start_date: new Date(body.start_date),
      });

      if (existingExperience) {
        throw new ExperienceAlreadyExistsException();
      }

      const experience = await this.experienceCollection.create({
        user_id: userId,
        start_date: new Date(body.start_date),
        end_date: body.end_date ? new Date(body.end_date) : null,
        location: body.location,
        designation: body.designation,
        description: body.description,
        responsibilities: body.responsibilities,
        organization_name: body.organization_name,
        organization_logo_url: body.organization_logo_url,
        organization_url: body.organization_url,
        tech_stack: body.tech_stack,
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

  async getExperienceById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidExperienceIdException();
      }

      const experience = await this.experienceCollection.findById(id);

      if (!experience) {
        throw new ExperienceNotFoundException();
      }

      return {
        success: true,
        data: experience,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch experience');
    }
  }

  async updateExperience(id: string, body: Partial<ResolvedExperienceInput>) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidExperienceIdException();
      }

      const experience = await this.experienceCollection.findById(id);

      if (!experience) {
        throw new ExperienceNotFoundException();
      }

      if (body.user_id !== undefined) {
        if (!Types.ObjectId.isValid(body.user_id)) {
          throw new InvalidExperienceUserIdException();
        }

        experience.user_id = new Types.ObjectId(body.user_id) as any;
      }

      if (body.start_date !== undefined) {
        experience.start_date = new Date(body.start_date) as any;
      }

      if (body.end_date !== undefined) {
        experience.end_date = body.end_date
          ? (new Date(body.end_date) as any)
          : null;
      }

      if (body.location !== undefined) {
        experience.location = body.location;
      }

      if (body.designation !== undefined) {
        experience.designation = body.designation;
      }

      if (body.description !== undefined) {
        experience.description = body.description;
      }

      if (body.responsibilities !== undefined) {
        experience.responsibilities = body.responsibilities;
      }

      if (body.organization_name !== undefined) {
        experience.organization_name = body.organization_name;
      }

      if (body.organization_logo_url !== undefined) {
        experience.organization_logo_url = body.organization_logo_url as any;
      }

      if (body.organization_url !== undefined) {
        experience.organization_url = body.organization_url;
      }

      if (body.tech_stack !== undefined) {
        experience.tech_stack = body.tech_stack;
      }

      await experience.save();

      return {
        success: true,
        data: experience,
        message: 'Experience updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update experience');
    }
  }

  async deleteExperience(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidExperienceIdException();
      }

      const deleted = await this.experienceCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new ExperienceNotFoundException();
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
