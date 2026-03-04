import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete
} from '@nestjs/common';

import { ProjectService } from './project.service';
import { ProjectDto } from 'src/dto/project.dto';

@Controller('project')
export class ProjectController {

  constructor(
    private readonly projectService: ProjectService
  ) {}

  @Post()
  async createProject(@Body() body: ProjectDto) {
    return this.projectService.createProject(body);
  }

  @Get()
  async getAllProjects() {
    return this.projectService.getAllProjects();
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @Patch(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() body: Partial<ProjectDto>
  ) {
    return this.projectService.updateProject(id, body);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}