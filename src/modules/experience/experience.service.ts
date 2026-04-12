import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  ExperienceAlreadyExistsException,
  ExperienceNotFoundException,
  ExperienceSearchQueryRequiredException,
  ExperienceUserNotFoundException,
  InvalidExperienceIdException,
  InvalidExperienceUserIdException,
} from 'src/exceptions/experience.exceptions';
import { ResolvedExperienceInput } from 'src/interfaces';
import { Experience, ExperienceDocument } from 'src/schema/experience.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceCollection: Model<ExperienceDocument>,
    @InjectModel(User.name)
    private readonly userCollection: Model<UserDocument>,
  ) {}

  async createExperience(body: ResolvedExperienceInput) {
    try {
      if (!Types.ObjectId.isValid(body.user_id)) {
        throw new InvalidExperienceUserIdException();
      }

      const userId = new Types.ObjectId(body.user_id);
      await this.ensureUserExists(userId);

      const startDate = new Date(body.start_date);
      const existingExperience = await this.experienceCollection.findOne({
        user_id: userId,
        organization_name: body.organization_name,
        designation: body.designation,
        start_date: startDate,
      });

      if (existingExperience) {
        throw new ExperienceAlreadyExistsException();
      }

      const experience = await this.experienceCollection.create({
        user_id: userId,
        start_date: startDate,
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

  async searchExperiences(query: {
    user_id?: string;
    designation?: string;
    organization_name?: string;
  }) {
    try {
      const userId = query.user_id?.trim();
      const designation = query.designation?.trim();
      const organizationName = query.organization_name?.trim();

      if (!userId && !designation && !organizationName) {
        throw new ExperienceSearchQueryRequiredException();
      }

      const filters: Record<string, unknown> = {};

      if (userId) {
        if (!Types.ObjectId.isValid(userId)) {
          throw new InvalidExperienceUserIdException();
        }

        filters.user_id = new Types.ObjectId(userId);
      }

      if (designation) {
        filters.designation = {
          $regex: this.escapeRegex(designation),
          $options: 'i',
        };
      }

      if (organizationName) {
        filters.organization_name = {
          $regex: this.escapeRegex(organizationName),
          $options: 'i',
        };
      }

      const experiences = await this.experienceCollection
        .find(filters)
        .sort({ start_date: -1 });

      return {
        success: true,
        data: experiences,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to search experiences');
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

      const nextUserId = await this.resolveUserId(
        body.user_id,
        experience.user_id,
      );
      const nextStartDate =
        body.start_date !== undefined
          ? new Date(body.start_date)
          : experience.start_date;
      const nextOrganizationName =
        body.organization_name ?? experience.organization_name;
      const nextDesignation = body.designation ?? experience.designation;

      await this.ensureExperienceDoesNotExist({
        user_id: nextUserId,
        organization_name: nextOrganizationName,
        designation: nextDesignation,
        start_date: nextStartDate,
        excludeId: experience._id.toString(),
      });

      if (body.user_id !== undefined) {
        experience.user_id = nextUserId;
      }

      if (body.start_date !== undefined) {
        experience.start_date = nextStartDate;
      }

      if (body.end_date !== undefined) {
        experience.end_date = body.end_date ? new Date(body.end_date) : null;
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
        experience.organization_logo_url = body.organization_logo_url;
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

  private async resolveUserId(
    nextUserId: string | undefined,
    currentUserId: Types.ObjectId,
  ): Promise<Types.ObjectId> {
    if (nextUserId === undefined) {
      return currentUserId;
    }

    if (!Types.ObjectId.isValid(nextUserId)) {
      throw new InvalidExperienceUserIdException();
    }

    const userId = new Types.ObjectId(nextUserId);
    await this.ensureUserExists(userId);

    return userId;
  }

  private async ensureUserExists(userId: Types.ObjectId) {
    const existingUser = await this.userCollection.findById(userId);

    if (!existingUser) {
      throw new ExperienceUserNotFoundException();
    }
  }

  private async ensureExperienceDoesNotExist(input: {
    user_id: Types.ObjectId;
    organization_name: string;
    designation: string;
    start_date: Date;
    excludeId?: string;
  }) {
    const existingExperience = await this.experienceCollection.findOne({
      user_id: input.user_id,
      organization_name: input.organization_name,
      designation: input.designation,
      start_date: input.start_date,
    });

    if (
      existingExperience &&
      existingExperience._id.toString() !== input.excludeId
    ) {
      throw new ExperienceAlreadyExistsException();
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
