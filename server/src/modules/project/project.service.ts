import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProject, UpdateProject } from 'src/interfaces';
import { Project } from 'src/schema/project.schema';
import { handleError } from 'src/utils/error-handler';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name, 'db')
    private readonly projectCollection: Model<Project>,
  ) {}

  // CREATE PROJECT
  async createProject(body: CreateProject) {
    try {
      const project = await this.projectCollection.create(body);

      return {
        success: true,
        data: project,
        message: 'Project created successfully',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to create project');
    }
  }

  // GET ALL PROJECTS
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

  // GET PROJECT BY ID
  async getProjectById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid project id');
      }

      const project = await this.projectCollection.findById(id);

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      return {
        success: true,
        data: project,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch project');
    }
  }

  // UPDATE PROJECT
  async updateProject(id: string, body: UpdateProject) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid project id');
      }

      const updated = await this.projectCollection.findByIdAndUpdate(
        id,
        body,
        { new: true },
      );

      if (!updated) {
        throw new NotFoundException('Project not found');
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

  // DELETE PROJECT
  async deleteProject(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid project id');
      }

      const deleted = await this.projectCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundException('Project not found');
      }

      return {
        success: true,
        message: 'Project deleted successfully',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete project');
    }
  }
}