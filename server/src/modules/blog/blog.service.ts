import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  BlogNotFoundException,
  BlogSlugAlreadyExistsException,
  InvalidBlogIdException,
} from 'src/exceptions/blog.exceptions';
import { CreateBlog, UpdateBlog } from 'src/interfaces';
import { Blog } from 'src/schema/blog.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogCollection: Model<Blog>,
  ) {}

  // CREATE
  async createBlog(body: CreateBlog) {
    try {
      const existing = await this.blogCollection.findOne({
        slug: body.slug,
      });

      if (existing) {
        throw new BlogSlugAlreadyExistsException();
      }

      const blog = await this.blogCollection.create({
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

  // GET ALL
  async getAllBlogs() {
    try {
      const blogs = await this.blogCollection.find().sort({ createdAt: -1 });

      return {
        success: true,
        data: blogs,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch blogs');
    }
  }

  // GET BY ID
  async getBlogById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidBlogIdException();
      }

      const blog = await this.blogCollection.findById(id);

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

  // UPDATE
  async updateBlog(id: string, body: UpdateBlog) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidBlogIdException();
      }

      const updated = await this.blogCollection.findByIdAndUpdate(
        id,
        {
          ...body,
          'metadata.lastModified': new Date(),
        },
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

  // DELETE
  async deleteBlog(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidBlogIdException();
      }

      const deleted = await this.blogCollection.findByIdAndDelete(id);

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
}
