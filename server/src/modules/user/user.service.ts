import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';
import { UserCreate, UserUpdate } from 'src/interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, 'db')
    private readonly userCollection: Model<User>,
  ) {}

  // CREATE
  async createUser(body: UserCreate) {
    try {
      const user = await this.userCollection.create({
        ...body,
        skills: body.skills?.map((id) => new Types.ObjectId(id)),
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

  // GET ALL
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

  // GET BY ID
  async getUserById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid user ID');
      }

      const user = await this.userCollection.findById(id).populate('skills');

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        success: true,
        data: user,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch user');
    }
  }

  // UPDATE
  async updateUser(id: string, body: UserUpdate) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid user ID');
      }

      if (body.skills) {
        body.skills = body.skills.map((id) => new Types.ObjectId(id) as any);
      }

      const updated = await this.userCollection.findByIdAndUpdate(id, body, {
        new: true,
      });

      if (!updated) {
        throw new NotFoundException('User not found');
      }

      return {
        success: true,
        data: updated,
        message: 'User updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update user');
    }
  }

  // DELETE
  async deleteUser(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid user ID');
      }

      const deleted = await this.userCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundException('User not found');
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
