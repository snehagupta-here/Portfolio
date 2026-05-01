import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  BlogUserNotFoundException,
  BlogNotFoundException,
  BlogSearchQueryRequiredException,
  BlogSlugAlreadyExistsException,
  InvalidBlogUserIdException,
  InvalidBlogIdException,
} from 'src/exceptions/blog.exceptions';
import { CreateBlog, UpdateBlog } from 'src/interfaces';
import { Blog, BlogDocument } from 'src/schema/blog.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogCollection: Model<BlogDocument>,
    @InjectModel(User.name)
    private readonly userCollection: Model<UserDocument>,
  ) {}

  async createBlog(userId: string, body: CreateBlog) {
    try {
      const scopedUserId = await this.resolveValidatedUserId(userId);
      const existing = await this.blogCollection.findOne({
        user_id: scopedUserId,
        slug: body.slug,
      });

      if (existing) {
        throw new BlogSlugAlreadyExistsException();
      }

      const blog = await this.blogCollection.create({
        user_id: scopedUserId,
        ...body,
        metadata: {
          ...body.metadata,
          publishedDate: body.metadata?.publishedDate
            ? new Date(body.metadata.publishedDate)
            : undefined,
          lastModified: new Date(),
        },
      });

      return {
        success: true,
        data: blog,
        message: 'Blog created successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to create blog');
    }
  }

  async getAllBlogs(userId: string) {
    try {
      const scopedUserId = await this.resolveValidatedUserId(userId);
      const blogs = await this.blogCollection
        .find({ user_id: scopedUserId })
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: blogs,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch blogs');
    }
  }

  async searchBlogs(
    userId: string,
    query: {
      title?: string;
      slug?: string;
      isActive?: string;
    },
  ) {
    try {
      const title = query.title?.trim();
      const slug = query.slug?.trim();
      const isActive = query.isActive?.trim();
      const scopedUserId = await this.resolveValidatedUserId(userId);

      if (!title && !slug && isActive === undefined) {
        throw new BlogSearchQueryRequiredException();
      }

      const filters: Record<string, unknown> = {
        user_id: scopedUserId,
      };

      if (title) {
        filters.title = {
          $regex: this.escapeRegex(title),
          $options: 'i',
        };
      }

      if (slug) {
        filters.slug = {
          $regex: this.escapeRegex(slug),
          $options: 'i',
        };
      }

      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }

      const blogs = await this.blogCollection
        .find(filters)
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: blogs,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to search blogs');
    }
  }

  async getBlogById(id: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidBlogIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const blog = await this.blogCollection.findOne({
        _id: id,
        user_id: scopedUserId,
      });

      if (!blog) {
        throw new BlogNotFoundException();
      }

      return {
        success: true,
        data: blog,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch blog');
    }
  }

  async updateBlog(id: string, userId: string, body: UpdateBlog) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidBlogIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const blog = await this.blogCollection.findOne({
        _id: id,
        user_id: scopedUserId,
      });

      if (!blog) {
        throw new BlogNotFoundException();
      }

      if (body.slug !== undefined && body.slug !== blog.slug) {
        const existing = await this.blogCollection.findOne({
          user_id: scopedUserId,
          slug: body.slug,
        });

        if (existing) {
          throw new BlogSlugAlreadyExistsException();
        }
      }

      const updatePayload: Record<string, unknown> = {
        ...body,
      };

      if (body.metadata !== undefined) {
        updatePayload.metadata = {
          ...body.metadata,
          publishedDate: body.metadata?.publishedDate
            ? new Date(body.metadata.publishedDate)
            : undefined,
          lastModified: new Date(),
        };
      } else {
        updatePayload['metadata.lastModified'] = new Date();
      }

      const updated = await this.blogCollection.findOneAndUpdate(
        { _id: id, user_id: scopedUserId },
        updatePayload,
        { new: true },
      );

      if (!updated) {
        throw new BlogNotFoundException();
      }

      return {
        success: true,
        data: updated,
        message: 'Blog updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update blog');
    }
  }

  async deleteBlog(id: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidBlogIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const deleted = await this.blogCollection.findOneAndDelete({
        _id: id,
        user_id: scopedUserId,
      });

      if (!deleted) {
        throw new BlogNotFoundException();
      }

      return {
        success: true,
        message: 'Blog deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete blog');
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async resolveValidatedUserId(
    userId: string,
  ): Promise<Types.ObjectId> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new InvalidBlogUserIdException();
    }

    const scopedUserId = new Types.ObjectId(userId);
    await this.ensureUserExists(scopedUserId);

    return scopedUserId;
  }

  private async ensureUserExists(userId: Types.ObjectId) {
    const user = await this.userCollection.findById(userId);

    if (!user) {
      throw new BlogUserNotFoundException();
    }
  }
}
