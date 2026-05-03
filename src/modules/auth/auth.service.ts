import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthLoginDto, AuthRegisterDto } from 'src/dto';
import { InvalidCredentialsException } from 'src/exceptions/auth.exceptions';
import { UserEmailAlreadyExistsException } from 'src/exceptions/user.exceptions';
import { User, UserDocument } from 'src/schema/user.schema';
import { hashPassword, normalizeEmail, verifyPassword } from 'src/utils/auth';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userCollection: Model<UserDocument>,
  ) {}

  async register(body: AuthRegisterDto) {
    try {
      const email = normalizeEmail(body.email);
      const existingUser = await this.userCollection.findOne({ email });

      if (existingUser) {
        throw new UserEmailAlreadyExistsException();
      }

      const user = await this.userCollection.create({
        name: body.name,
        email,
        password_hash: await hashPassword(body.password),
      });

      return {
        success: true,
        data: {
          userId: String(user._id),
        },
        message: 'User registered successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to register user');
    }
  }

  async login(body: AuthLoginDto) {
    try {
      const user = await this.userCollection
        .findOne({ email: normalizeEmail(body.email) })
        .select('+password_hash');

      if (!user?.password_hash) {
        throw new InvalidCredentialsException();
      }

      const isPasswordValid = await verifyPassword(
        body.password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        throw new InvalidCredentialsException();
      }

      return {
        success: true,
        data: {
          userId: String(user._id),
        },
        message: 'Authentication successful.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to authenticate user');
    }
  }
}
