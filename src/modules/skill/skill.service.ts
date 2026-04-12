import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryAssetDto } from 'src/dto/cloudinary.dto';

import {
  InvalidSkillIdException,
  SkillAlreadyExistsException,
  SkillNotFoundException,
  SkillSearchQueryRequiredException,
} from 'src/exceptions/skill.exceptions';
import type { ResolvedSkillInput } from 'src/interfaces';
import { Skill } from 'src/schema/skill.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill.name)
    private readonly skillCollection: Model<Skill>,
  ) {}

  async createSkill(body: ResolvedSkillInput) {
    try {
      const existingSkill = await this.skillCollection.findOne({
        name: body.name,
      });

      if (existingSkill) {
        throw new SkillAlreadyExistsException();
      }

      const skill = await this.skillCollection.create({
        name: body.name,
        category: body.category,
        icon: body.icon,
      });

      return {
        success: true,
        data: skill,
        message: 'Skill created successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to create skill');
    }
  }

  async getAllSkills() {
    try {
      const skills = await this.skillCollection.find().sort({ createdAt: -1 });

      return {
        success: true,
        data: skills,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch skills');
    }
  }

  async searchSkills(query: { name?: string; category?: string }) {
    try {
      const name = query.name?.trim();
      const category = query.category?.trim();

      if (!name && !category) {
        throw new SkillSearchQueryRequiredException();
      }

      const filters: Record<string, unknown> = {};

      if (name) {
        filters.name = {
          $regex: this.escapeRegex(name),
          $options: 'i',
        };
      }

      if (category) {
        filters.category = category;
      }

      const skills = await this.skillCollection
        .find(filters)
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: skills,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to search skills');
    }
  }

  async getSkillById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidSkillIdException();
      }

      const skill = await this.skillCollection.findById(id);

      if (!skill) {
        throw new SkillNotFoundException();
      }

      return {
        success: true,
        data: skill,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch skill');
    }
  }

  async updateSkill(id: string, body: Partial<ResolvedSkillInput>) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidSkillIdException();
      }

      const skill = await this.skillCollection.findById(id);

      if (!skill) {
        throw new SkillNotFoundException();
      }

      if (body.name !== undefined) {
        skill.name = body.name;
      }

      if (body.category !== undefined) {
        skill.category = body.category;
      }

      if (body.icon !== undefined) {
        skill.icon = body.icon as CloudinaryAssetDto;
      }

      await skill.save();

      return {
        success: true,
        data: skill,
        message: 'Skill updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update skill');
    }
  }

  async deleteSkill(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidSkillIdException();
      }

      const deleted = await this.skillCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new SkillNotFoundException();
      }

      return {
        success: true,
        message: 'Skill deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete skill');
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
