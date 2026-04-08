import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  InvalidUserIdException,
  UserNotFoundException,
} from 'src/exceptions/user.exceptions';
import { ResolvedUserInput } from 'src/interfaces';
import { User } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userCollection: Model<User>,
  ) {}

  async createUser(body: ResolvedUserInput) {
    try {
      const user = await this.userCollection.create({
        name: body.name,
        about: body.about,
        links: body.links,
        profile_image: body.profile_image,
        resume: body.resume,
        skills: body.skills?.map((skill) => ({
          skill_id: new Types.ObjectId(skill.skill_id),
          yoe: skill.yoe,
          scale: skill.scale,
        })),
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
        .populate('skills')
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

      const user = await this.userCollection.findById(id).populate('skills');

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
        user.name = body.name;
      }

      if (body.about !== undefined) {
        user.about = body.about;
      }

      if (body.links !== undefined) {
        user.links = body.links as any;
      }

      if (body.skills !== undefined) {
        user.skills = body.skills.map((skill) => ({
          skill_id: new Types.ObjectId(skill.skill_id),
          yoe: skill.yoe,
          scale: skill.scale,
        })) as any;
      }

      if (body.profile_image !== undefined) {
        user.profile_image = body.profile_image as any;
      }

      if (body.resume !== undefined) {
        user.resume = body.resume as any;
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
}
