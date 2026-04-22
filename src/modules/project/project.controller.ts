import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ProjectDto, SearchProjectQueryDto, UpdateProjectDto } from 'src/dto';

import { ProjectService } from './project.service';

@Controller('api/v1/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(@Body() body: ProjectDto) {
    return this.projectService.createProject(body);
  }

  @Get()
  async getAllProjects() {
    return this.projectService.getAllProjects();
  }

  @Get('search')
  async searchProjects(@Query() query: SearchProjectQueryDto) {
    return this.projectService.searchProjects(query);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @Patch(':id')
  async updateProject(@Param('id') id: string, @Body() body: UpdateProjectDto) {
    return this.projectService.updateProject(id, body);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}
