import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  InvalidTestimonialIdException,
  InvalidTestimonialUserIdException,
  TestimonialAlreadyExistsException,
  TestimonialNotFoundException,
  TestimonialSearchQueryRequiredException,
  TestimonialUserNotFoundException,
} from 'src/exceptions/testimonial.exceptions';
import {
  CreateTestimonial,
  UpdateTestimonial,
} from 'src/interfaces/testimonial.interface';
import {
  Testimonial,
  TestimonialDocument,
} from 'src/schema/testimonial.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly testimonialCollection: Model<TestimonialDocument>,
    @InjectModel(User.name)
    private readonly userCollection: Model<UserDocument>,
  ) {}

  async addTestimonial(body: CreateTestimonial) {
    try {
      if (!Types.ObjectId.isValid(body.user_id)) {
        throw new InvalidTestimonialUserIdException();
      }

      const userId = new Types.ObjectId(body.user_id);
      await this.ensureUserExists(userId);

      const testimonialDate = new Date(body.testimonial_date);
      await this.ensureTestimonialDoesNotExist({
        user_id: userId,
        name: body.name,
        testimonial_date: testimonialDate,
      });

      const testimonial = await this.testimonialCollection.create({
        user_id: userId,
        name: body.name,
        description: body.description,
        designation: body.designation,
        rating: body.rating,
        testimonial_date: testimonialDate,
      });

      return {
        success: true,
        data: testimonial,
        message: 'Testimonial successfully created.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to create testimonial');
    }
  }

  async getAllTestimonials() {
    try {
      const testimonials = await this.testimonialCollection
        .find()
        .sort({ testimonial_date: -1 });

      return {
        success: true,
        data: testimonials,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch testimonials');
    }
  }

  async searchTestimonials(query: {
    user_id?: string;
    name?: string;
    rating?: number;
  }) {
    try {
      const userId = query.user_id?.trim();
      const name = query.name?.trim();
      const rating = query.rating;

      if (!userId && !name && rating === undefined) {
        throw new TestimonialSearchQueryRequiredException();
      }

      const filters: Record<string, unknown> = {};

      if (userId) {
        if (!Types.ObjectId.isValid(userId)) {
          throw new InvalidTestimonialUserIdException();
        }

        filters.user_id = new Types.ObjectId(userId);
      }

      if (name) {
        filters.name = {
          $regex: this.escapeRegex(name),
          $options: 'i',
        };
      }

      if (rating !== undefined) {
        filters.rating = rating;
      }

      const testimonials = await this.testimonialCollection
        .find(filters)
        .sort({ testimonial_date: -1 });

      return {
        success: true,
        data: testimonials,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to search testimonials');
    }
  }

  async getTestimonialById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidTestimonialIdException();
      }

      const testimonial = await this.testimonialCollection.findById(id);

      if (!testimonial) {
        throw new TestimonialNotFoundException();
      }

      return {
        success: true,
        data: testimonial,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch testimonial');
    }
  }

  async updateTestimonial(id: string, body: UpdateTestimonial) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidTestimonialIdException();
      }

      const testimonial = await this.testimonialCollection.findById(id);

      if (!testimonial) {
        throw new TestimonialNotFoundException();
      }

      const nextUserId = await this.resolveUserId(
        body.user_id,
        testimonial.user_id,
      );
      const nextName = body.name ?? testimonial.name;
      const nextTestimonialDate =
        body.testimonial_date !== undefined
          ? new Date(body.testimonial_date)
          : testimonial.testimonial_date;

      await this.ensureTestimonialDoesNotExist({
        user_id: nextUserId,
        name: nextName,
        testimonial_date: nextTestimonialDate,
        excludeId: testimonial._id.toString(),
      });

      testimonial.user_id = nextUserId;

      if (body.name !== undefined) {
        testimonial.name = body.name;
      }

      if (body.description !== undefined) {
        testimonial.description = body.description;
      }

      if (body.designation !== undefined) {
        testimonial.designation = body.designation;
      }

      if (body.rating !== undefined) {
        testimonial.rating = body.rating;
      }

      if (body.testimonial_date !== undefined) {
        testimonial.testimonial_date = nextTestimonialDate;
      }

      await testimonial.save();

      return {
        success: true,
        data: testimonial,
        message: 'Testimonial successfully updated.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update testimonial');
    }
  }

  async deleteTestimonial(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidTestimonialIdException();
      }

      const deleted = await this.testimonialCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new TestimonialNotFoundException();
      }

      return {
        success: true,
        message: 'Testimonial successfully deleted.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete testimonial');
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
      throw new InvalidTestimonialUserIdException();
    }

    const userId = new Types.ObjectId(nextUserId);
    await this.ensureUserExists(userId);

    return userId;
  }

  private async ensureUserExists(userId: Types.ObjectId) {
    const user = await this.userCollection.findById(userId);

    if (!user) {
      throw new TestimonialUserNotFoundException();
    }
  }

  private async ensureTestimonialDoesNotExist(input: {
    user_id: Types.ObjectId;
    name: string;
    testimonial_date: Date;
    excludeId?: string;
  }) {
    const existingTestimonial = await this.testimonialCollection.findOne({
      user_id: input.user_id,
      name: input.name,
      testimonial_date: input.testimonial_date,
    });

    if (
      existingTestimonial &&
      existingTestimonial._id.toString() !== input.excludeId
    ) {
      throw new TestimonialAlreadyExistsException();
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
