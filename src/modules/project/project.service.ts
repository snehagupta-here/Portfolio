import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateProject, UpdateProject } from 'src/interfaces';
import {
  InvalidProjectUserIdException,
  InvalidProjectIdException,
  ProjectUserNotFoundException,
  ProjectSearchQueryRequiredException,
  ProjectSlugAlreadyExistsException,
  ProjectNotFoundException,
} from 'src/exceptions/project.exceptions';
import { Project, ProjectDocument } from 'src/schema/project.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectCollection: Model<ProjectDocument>,
    @InjectModel(User.name)
    private readonly userCollection: Model<UserDocument>,
  ) {}

  async createProject(userId: string, body: CreateProject) {
    try {
      const scopedUserId = await this.resolveValidatedUserId(userId);
      const existingProject = await this.projectCollection.findOne({
        user_id: scopedUserId,
        slug: body.slug,
      });

      if (existingProject) {
        throw new ProjectSlugAlreadyExistsException();
      }

      const now = new Date();
      const project = await this.projectCollection.create({
        user_id: scopedUserId,
        ...body,
        meta: body.meta
          ? {
              ...body.meta,
              completedAt: body.meta.completedAt
                ? new Date(body.meta.completedAt)
                : undefined,
            }
          : undefined,
        metadata: {
          ...body.metadata,
          publishedDate: body.metadata?.publishedDate
            ? new Date(body.metadata.publishedDate)
            : now,
          lastModified: now,
        },
      });

      return {
        success: true,
        data: project,
        message: 'Project created successfully',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to create project');
    }
  }

  async getAllProjects(userId: string) {
    try {
      const scopedUserId = await this.resolveValidatedUserId(userId);
      const projects = await this.projectCollection
        .find({ user_id: scopedUserId, isActive: true })
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: projects,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch projects');
    }
  }

  async searchProjects(
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
        throw new ProjectSearchQueryRequiredException();
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

      const projects = await this.projectCollection
        .find(filters)
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: projects,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to search projects');
    }
  }

  async getProjectById(id: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidProjectIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const project = await this.projectCollection.findOne({
        _id: id,
        user_id: scopedUserId,
      });

      if (!project) {
        throw new ProjectNotFoundException();
      }

      return {
        success: true,
        data: project,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch project');
    }
  }

  async updateProject(id: string, userId: string, body: UpdateProject) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidProjectIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const project = await this.projectCollection.findOne({
        _id: id,
        user_id: scopedUserId,
      });

      if (!project) {
        throw new ProjectNotFoundException();
      }

      if (body.slug !== undefined && body.slug !== project.slug) {
        const existingProject = await this.projectCollection.findOne({
          user_id: scopedUserId,
          slug: body.slug,
        });

        if (existingProject) {
          throw new ProjectSlugAlreadyExistsException();
        }
      }

      const updatePayload: Record<string, unknown> = {
        ...body,
      };
      const now = new Date();

      if (body.meta !== undefined) {
        updatePayload.meta = {
          ...body.meta,
          completedAt: body.meta.completedAt
            ? new Date(body.meta.completedAt)
            : undefined,
        };
      }

      if (body.metadata !== undefined) {
        const currentProject = project.toObject() as {
          createdAt?: Date;
          metadata?: UpdateProject['metadata'];
        };

        updatePayload.metadata = {
          ...currentProject.metadata,
          ...body.metadata,
          publishedDate: body.metadata.publishedDate
            ? new Date(body.metadata.publishedDate)
            : currentProject.metadata?.publishedDate ||
              currentProject.createdAt ||
              now,
          lastModified: now,
        };
      } else {
        updatePayload['metadata.lastModified'] = now;
      }

      const updated = await this.projectCollection.findOneAndUpdate(
        { _id: id, user_id: scopedUserId },
        updatePayload,
        {
          new: true,
        },
      );

      if (!updated) {
        throw new ProjectNotFoundException();
      }

      return {
        success: true,
        data: updated,
        message: 'Project updated successfully',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update project');
    }
  }

  async deleteProject(id: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidProjectIdException();
      }

      const scopedUserId = await this.resolveValidatedUserId(userId);
      const deleted = await this.projectCollection.findOneAndDelete({
        _id: id,
        user_id: scopedUserId,
      });

      if (!deleted) {
        throw new ProjectNotFoundException();
      }

      return {
        success: true,
        message: 'Project deleted successfully',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete project');
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async resolveValidatedUserId(
    userId: string,
  ): Promise<Types.ObjectId> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new InvalidProjectUserIdException();
    }

    const scopedUserId = new Types.ObjectId(userId);
    await this.ensureUserExists(scopedUserId);

    return scopedUserId;
  }

  private async ensureUserExists(userId: Types.ObjectId) {
    const user = await this.userCollection.findById(userId);

    if (!user) {
      throw new ProjectUserNotFoundException();
    }
  }
}
