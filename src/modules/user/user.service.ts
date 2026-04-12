import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  InvalidUserSkillIdException,
  InvalidUserIdException,
  UserAlreadyExistsException,
  UserNotFoundException,
  UserSearchQueryRequiredException,
  UserSkillNotFoundException,
} from 'src/exceptions/user.exceptions';
import { ResolvedUserInput } from 'src/interfaces';
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

  async createUser(body: ResolvedUserInput) {
    try {
      const existingUser = await this.userCollection.findOne({
        name: body.name,
      });

      if (existingUser) {
        throw new UserAlreadyExistsException();
      }

      const resolvedLinks =
        body.links !== undefined ? this.resolveLinks(body.links) : undefined;
      const resolvedSkills =
        body.skills !== undefined
          ? await this.resolveSkills(body.skills)
          : undefined;

      const user = await this.userCollection.create({
        name: body.name,
        about: body.about,
        links: resolvedLinks,
        profile_image: body.profile_image,
        resume: body.resume,
        skills: resolvedSkills,
      });

      return {
        success: true,
        data: user,
        message: 'User created successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to create user');
    }
  }

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

  async updateUser(id: string, body: Partial<ResolvedUserInput>) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidUserIdException();
      }

      const user = await this.userCollection.findById(id);

      if (!user) {
        throw new UserNotFoundException();
      }

      if (body.name !== undefined) {
        const existingUser = await this.userCollection.findOne({
          name: body.name,
          _id: { $ne: id },
        });

        if (existingUser) {
          throw new UserAlreadyExistsException();
        }

        user.name = body.name;
      }

      if (body.about !== undefined) {
        user.about = body.about;
      }

      if (body.links !== undefined) {
        user.links = this.resolveLinks(body.links);
      }

      if (body.skills !== undefined) {
        user.skills = await this.resolveSkills(body.skills);
      }

      if (body.profile_image !== undefined) {
        user.profile_image = body.profile_image;
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

  private resolveLinks(
    links: NonNullable<ResolvedUserInput['links']>,
  ): UserDocument['links'] {
    return links.map((link) => ({
      name: link.name,
      icon: link.icon,
      url: link.url,
    }));
  }

  private async resolveSkills(
    skills: NonNullable<ResolvedUserInput['skills']>,
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
