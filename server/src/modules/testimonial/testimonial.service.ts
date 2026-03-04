import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Testimonial } from 'src/schema/testimonial.schema';
import { handleError } from 'src/utils/error-handler';
import {
  CreateTestimonial,
  UpdateTestimonial,
} from 'src/interfaces/testimonial.interface';
@Injectable()
export class TestimonialService {
  constructor(
    @InjectModel(Testimonial.name, 'db')
    private readonly testimonialCollection: Model<Testimonial>,
  ) {}

  // CREATE
  async addTestimonial(body: CreateTestimonial) {
    try {
      if (!Types.ObjectId.isValid(body.user_id)) {
        throw new BadRequestException('Invalid user_id');
      }

      const testimonial = await this.testimonialCollection.create({
        ...body,
        user_id: new Types.ObjectId(body.user_id),
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

  // GET ALL
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

  // GET BY ID
  async getTestimonialById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid testimonial ID');
      }

      const testimonial = await this.testimonialCollection.findById(id);

      if (!testimonial) {
        throw new NotFoundException('Testimonial not found');
      }

      return {
        success: true,
        data: testimonial,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch testimonial');
    }
  }

  // UPDATE
  async updateTestimonial(id: string, body: UpdateTestimonial) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid testimonial ID');
      }

      const updated = await this.testimonialCollection.findByIdAndUpdate(
        id,
        body,
        { new: true },
      );

      if (!updated) {
        throw new NotFoundException('Testimonial not found');
      }

      return {
        success: true,
        data: updated,
        message: 'Testimonial successfully updated.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update testimonial');
    }
  }

  // DELETE
  async deleteTestimonial(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid testimonial ID');
      }

      const deleted = await this.testimonialCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundException('Testimonial not found');
      }

      return {
        success: true,
        message: 'Testimonial successfully deleted.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete testimonial');
    }
  }
}
