import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from 'src/schema/blog.schema';
import { handleError } from 'src/utils/error-handler';
import { CreateBlog, UpdateBlog } from 'src/interfaces';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name, 'db')
    private readonly blogCollection: Model<Blog>,
  ) {}

  // CREATE
  async createBlog(body: CreateBlog) {
    try {
      const existing = await this.blogCollection.findOne({
        slug: body.slug,
      });

      if (existing) {
        throw new BadRequestException('Slug already exists');
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
      const blog = await this.blogCollection.findById(id);

      if (!blog) {
        throw new NotFoundException('Blog not found');
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
      const updated = await this.blogCollection.findByIdAndUpdate(
        id,
        {
          ...body,
          'metadata.lastModified': new Date(),
        },
        { new: true },
      );

      if (!updated) {
        throw new NotFoundException('Blog not found');
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
      const deleted = await this.blogCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundException('Blog not found');
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
