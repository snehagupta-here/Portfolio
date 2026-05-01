import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateProject, ProjectImage, UpdateProject } from 'src/interfaces';
import { CloudinaryImageAsset } from 'src/interfaces/image.interface';
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
      const normalizedBody = this.normalizeProjectPayload(body);
      const existingProject = await this.projectCollection.findOne({
        user_id: scopedUserId,
        slug: normalizedBody.slug,
      });

      if (existingProject) {
        throw new ProjectSlugAlreadyExistsException();
      }

      const now = new Date();
      const project = await this.projectCollection.create({
        user_id: scopedUserId,
        ...normalizedBody,
        meta: normalizedBody.meta
          ? {
              ...normalizedBody.meta,
              completedAt: normalizedBody.meta.completedAt
                ? new Date(normalizedBody.meta.completedAt)
                : undefined,
            }
          : undefined,
        metadata: {
          ...normalizedBody.metadata,
          publishedDate: normalizedBody.metadata?.publishedDate
            ? new Date(normalizedBody.metadata.publishedDate)
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

      const normalizedBody = this.normalizeProjectPayload(body);

      if (
        normalizedBody.slug !== undefined &&
        normalizedBody.slug !== project.slug
      ) {
        const existingProject = await this.projectCollection.findOne({
          user_id: scopedUserId,
          slug: normalizedBody.slug,
        });

        if (existingProject) {
          throw new ProjectSlugAlreadyExistsException();
        }
      }

      const updatePayload: Record<string, unknown> = {
        ...normalizedBody,
      };
      const now = new Date();

      if (normalizedBody.meta !== undefined) {
        updatePayload.meta = {
          ...normalizedBody.meta,
          completedAt: normalizedBody.meta.completedAt
            ? new Date(normalizedBody.meta.completedAt)
            : undefined,
        };
      }

      if (normalizedBody.metadata !== undefined) {
        const currentProject = project.toObject() as {
          createdAt?: Date;
          metadata?: UpdateProject['metadata'];
        };

        updatePayload.metadata = {
          ...currentProject.metadata,
          ...normalizedBody.metadata,
          publishedDate: normalizedBody.metadata.publishedDate
            ? new Date(normalizedBody.metadata.publishedDate)
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

  private normalizeProjectPayload<T extends CreateProject | UpdateProject>(
    body: T,
  ): T {
    const { thumbnail, author, content, ...rest } = body;

    return {
      ...rest,
      content: content?.map((section) => ({
        ...section,
        images: this.normalizeProjectImages(section.images),
        items: section.items?.map((item) => ({
          ...item,
          images: this.normalizeProjectImages(item.images),
        })),
      })),
      thumbnail: this.normalizeImageAsset(thumbnail),
      author: author
        ? {
            ...author,
            avatar: this.normalizeImageUrl(author.avatar),
          }
        : undefined,
    } as T;
  }

  private normalizeProjectImages(
    images?: ProjectImage[],
  ): ProjectImage[] | undefined {
    return images?.map((image) => ({
      ...image,
      url: this.normalizeImageUrl(image.url),
    }));
  }

  private normalizeImageAsset(
    image?: CloudinaryImageAsset | string,
  ): CloudinaryImageAsset | undefined {
    if (image === undefined || image === null) {
      return undefined;
    }

    if (typeof image === 'string') {
      const trimmedImage = image.trim();

      return {
        publicId: trimmedImage,
        secureUrl: trimmedImage,
      };
    }

    return image;
  }

  private normalizeImageUrl(
    image?: CloudinaryImageAsset | string,
  ): string | undefined {
    if (image === undefined || image === null) {
      return undefined;
    }

    if (typeof image === 'string') {
      return image.trim();
    }

    return image.secureUrl;
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
