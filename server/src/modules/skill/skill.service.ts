import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Skill } from 'src/schema/skill.schema';
import { handleError } from 'src/utils/error-handler';
import { CreateSkill, UpdateSkill } from 'src/interfaces';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill.name, 'db')
    private readonly skillCollection: Model<Skill>,
  ) {}

  // CREATE
  async createSkill(body: CreateSkill) {
    try {
      if (!Types.ObjectId.isValid(body.user_id)) {
        throw new BadRequestException('Invalid user_id');
      }

      const skill = await this.skillCollection.create({
        ...body,
        user_id: new Types.ObjectId(body.user_id),
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

  // GET ALL
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

  // GET BY ID
  async getSkillById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid skill ID');
      }

      const skill = await this.skillCollection.findById(id);

      if (!skill) {
        throw new NotFoundException('Skill not found');
      }

      return {
        success: true,
        data: skill,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch skill');
    }
  }

  // UPDATE
  async updateSkill(id: string, body: UpdateSkill) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid skill ID');
      }

      const updated = await this.skillCollection.findByIdAndUpdate(id, body, {
        new: true,
      });

      if (!updated) {
        throw new NotFoundException('Skill not found');
      }

      return {
        success: true,
        data: updated,
        message: 'Skill updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update skill');
    }
  }

  // DELETE
  async deleteSkill(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid skill ID');
      }

      const deleted = await this.skillCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundException('Skill not found');
      }

      return {
        success: true,
        message: 'Skill deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete skill');
    }
  }
}
