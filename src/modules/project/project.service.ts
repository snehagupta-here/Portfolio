import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateProject, UpdateProject } from 'src/interfaces';
import {
  InvalidProjectIdException,
  ProjectSearchQueryRequiredException,
  ProjectSlugAlreadyExistsException,
  ProjectNotFoundException,
} from 'src/exceptions/project.exceptions';
import { Project, ProjectDocument } from 'src/schema/project.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectCollection: Model<ProjectDocument>,
  ) {}

  async createProject(body: CreateProject) {
    try {
      const existingProject = await this.projectCollection.findOne({
        slug: body.slug,
      });

      if (existingProject) {
        throw new ProjectSlugAlreadyExistsException();
      }

      const now = new Date();
      const project = await this.projectCollection.create({
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

  async getAllProjects() {
    try {
      const projects = await this.projectCollection
        .find({ isActive: true })
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: projects,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch projects');
    }
  }

  async searchProjects(query: {
    title?: string;
    slug?: string;
    isActive?: string;
  }) {
    try {
      const title = query.title?.trim();
      const slug = query.slug?.trim();
      const isActive = query.isActive?.trim();

      if (!title && !slug && isActive === undefined) {
        throw new ProjectSearchQueryRequiredException();
      }

      const filters: Record<string, unknown> = {};

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

  async getProjectById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidProjectIdException();
      }

      const project = await this.projectCollection.findById(id);

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

  async updateProject(id: string, body: UpdateProject) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidProjectIdException();
      }

      const project = await this.projectCollection.findById(id);

      if (!project) {
        throw new ProjectNotFoundException();
      }

      if (body.slug !== undefined && body.slug !== project.slug) {
        const existingProject = await this.projectCollection.findOne({
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

      const updated = await this.projectCollection.findByIdAndUpdate(
        id,
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

  async deleteProject(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidProjectIdException();
      }

      const deleted = await this.projectCollection.findByIdAndDelete(id);

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
}
