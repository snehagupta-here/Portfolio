import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  InvalidUserSkillIdException,
  InvalidUserIdException,
  UserNotFoundException,
  UserSearchQueryRequiredException,
  UserSkillNotFoundException,
} from 'src/exceptions/user.exceptions';
import { UserUpdate } from 'src/interfaces';
import { Skill } from 'src/schema/skill.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userCollection: Model<UserDocument>,
    @InjectModel(Skill.name)
    private readonly skillCollection: Model<Skill>,
  ) {}

  async getAllUsers() {
    try {
      const users = await this.userCollection
        .find()
        .populate('skills.skill_id')
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: users,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch users');
    }
  }

  async getUserById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidUserIdException();
      }

      const user = await this.userCollection
        .findById(id)
        .populate('skills.skill_id');

      if (!user) {
        throw new UserNotFoundException();
      }

      return {
        success: true,
        data: user,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch user');
    }
  }

  async searchUsers(query: { name?: string; skill_id?: string }) {
    try {
      const name = query.name?.trim();
      const skillId = query.skill_id?.trim();

      if (!name && !skillId) {
        throw new UserSearchQueryRequiredException();
      }

      const filters: Record<string, unknown> = {};

      if (name) {
        filters.name = {
          $regex: this.escapeRegex(name),
          $options: 'i',
        };
      }

      if (skillId) {
        if (!Types.ObjectId.isValid(skillId)) {
          throw new InvalidUserSkillIdException();
        }

        filters['skills.skill_id'] = new Types.ObjectId(skillId);
      }

      const users = await this.userCollection
        .find(filters)
        .populate('skills.skill_id')
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: users,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to search users');
    }
  }

  async updateUser(id: string, body: UserUpdate) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidUserIdException();
      }

      const user = await this.userCollection.findById(id);

      if (!user) {
        throw new UserNotFoundException();
      }

      if (body.name !== undefined) {
        user.name = body.name;
      }

      if (body.title !== undefined) {
        user.title = body.title;
      }

      if (body.tagline !== undefined) {
        user.tagline = body.tagline;
      }

      if (body.bio !== undefined) {
        user.bio = body.bio;
      }

      if (body.email !== undefined) {
        user.email = body.email.trim() || undefined;
      }

      if (body.avatar !== undefined) {
        user.avatar = body.avatar;
      }

      if (body.aboutHeading !== undefined) {
        user.aboutHeading = body.aboutHeading;
      }

      if (body.aboutBio !== undefined) {
        user.aboutBio = body.aboutBio;
      }

      if (body.totalYearsExperience !== undefined) {
        user.totalYearsExperience = body.totalYearsExperience;
      }

      if (body.projectsCompleted !== undefined) {
        user.projectsCompleted = body.projectsCompleted;
      }

      if (body.location !== undefined) {
        user.location = body.location;
      }

      if (body.paragraphs !== undefined) {
        user.paragraphs = body.paragraphs;
      }

      if (body.highlights !== undefined) {
        user.highlights = this.resolveHighlights(body.highlights);
      }

      if (body.socialLinks !== undefined) {
        user.socialLinks = this.resolveSocialLinks(body.socialLinks);
      }

      if (body.skills !== undefined) {
        user.skills = await this.resolveSkills(body.skills);
      }

      if (body.resume !== undefined) {
        user.resume = body.resume;
      }

      await user.save();

      return {
        success: true,
        data: user,
        message: 'User updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update user');
    }
  }

  async deleteUser(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidUserIdException();
      }

      const deleted = await this.userCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new UserNotFoundException();
      }

      return {
        success: true,
        message: 'User deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete user');
    }
  }

  private resolveSocialLinks(
    links: NonNullable<UserUpdate['socialLinks']>,
  ): UserDocument['socialLinks'] {
    return links.map((link) => ({
      id: link.id,
      name: link.name,
      icon: link.icon,
      url: link.url,
    }));
  }

  private resolveHighlights(
    highlights: NonNullable<UserUpdate['highlights']>,
  ): UserDocument['highlights'] {
    return highlights.map((highlight) => ({
      id: highlight.id,
      title: highlight.title,
      description: highlight.description,
    }));
  }

  private async resolveSkills(
    skills: NonNullable<UserUpdate['skills']>,
  ): Promise<UserDocument['skills']> {
    for (const skill of skills) {
      if (!Types.ObjectId.isValid(skill.skill_id)) {
        throw new InvalidUserSkillIdException();
      }
    }

    const uniqueSkillIds = [...new Set(skills.map((skill) => skill.skill_id))];

    if (uniqueSkillIds.length > 0) {
      const existingSkills = await this.skillCollection.countDocuments({
        _id: {
          $in: uniqueSkillIds.map((skillId) => new Types.ObjectId(skillId)),
        },
      });

      if (existingSkills !== uniqueSkillIds.length) {
        throw new UserSkillNotFoundException();
      }
    }

    return skills.map((skill) => ({
      skill_id: new Types.ObjectId(skill.skill_id),
      yoe: skill.yoe,
      scale: skill.scale,
    }));
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
