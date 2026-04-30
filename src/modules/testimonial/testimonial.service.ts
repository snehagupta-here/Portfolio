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

  async addTestimonial(userId: string, body: CreateTestimonial) {
    try {
      const scopedUserId = await this.resolveValidatedUserId(userId);

      const testimonialDate = new Date(body.testimonial_date);
      await this.ensureTestimonialDoesNotExist({
        user_id: scopedUserId,
        name: body.name,
        testimonial_date: testimonialDate,
      });

      const testimonial = await this.testimonialCollection.create({
        user_id: scopedUserId,
        name: body.name,
        description: body.description,
        designation: body.designation,
        image: body.image,
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

  async getAllTestimonials(userId: string) {
    try {
      const scopedUserId = await this.resolveValidatedUserId(userId);
      const testimonials = await this.testimonialCollection
        .find({ user_id: scopedUserId })
        .sort({ testimonial_date: -1 });

      return {
        success: true,
        data: testimonials,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch testimonials');
    }
  }

  async searchTestimonials(
    userId: string,
    query: {
      name?: string;
      rating?: number;
    },
  ) {
    try {
      const name = query.name?.trim();
      const rating = query.rating;
      const scopedUserId = await this.resolveValidatedUserId(userId);

      if (!name && rating === undefined) {
        throw new TestimonialSearchQueryRequiredException();
      }

      const filters: Record<string, unknown> = {
        user_id: scopedUserId,
      };

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

  async getTestimonialById(id: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidTestimonialIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const testimonial = await this.testimonialCollection.findOne({
        _id: id,
        user_id: scopedUserId,
      });

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

  async updateTestimonial(id: string, userId: string, body: UpdateTestimonial) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidTestimonialIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const testimonial = await this.testimonialCollection.findOne({
        _id: id,
        user_id: scopedUserId,
      });

      if (!testimonial) {
        throw new TestimonialNotFoundException();
      }

      const nextName = body.name ?? testimonial.name;
      const nextTestimonialDate =
        body.testimonial_date !== undefined
          ? new Date(body.testimonial_date)
          : testimonial.testimonial_date;

      await this.ensureTestimonialDoesNotExist({
        user_id: scopedUserId,
        name: nextName,
        testimonial_date: nextTestimonialDate,
        excludeId: testimonial._id.toString(),
      });

      if (body.name !== undefined) {
        testimonial.name = body.name;
      }

      if (body.description !== undefined) {
        testimonial.description = body.description;
      }

      if (body.designation !== undefined) {
        testimonial.designation = body.designation;
      }

      if (body.image !== undefined) {
        testimonial.image = body.image;
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

  async deleteTestimonial(id: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidTestimonialIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const deleted = await this.testimonialCollection.findOneAndDelete({
        _id: id,
        user_id: scopedUserId,
      });

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

  private async resolveValidatedUserId(
    userId: string,
  ): Promise<Types.ObjectId> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new InvalidTestimonialUserIdException();
    }

    const resolvedUserId = new Types.ObjectId(userId);
    await this.ensureUserExists(resolvedUserId);

    return resolvedUserId;
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
