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

import {
  ProjectDto,
  ProjectScopedIdParamDto,
  ProjectUserParamDto,
  SearchProjectQueryDto,
  UpdateProjectDto,
} from 'src/dto';

import { ProjectService } from './project.service';

@Controller('api/v1/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post(':user_id')
  async createProject(
    @Param() params: ProjectUserParamDto,
    @Body() body: ProjectDto,
  ) {
    return this.projectService.createProject(params.user_id, body);
  }

  @Get(':user_id')
  async getAllProjects(@Param() params: ProjectUserParamDto) {
    return this.projectService.getAllProjects(params.user_id);
  }

  @Get(':user_id/search')
  async searchProjects(
    @Param() params: ProjectUserParamDto,
    @Query() query: SearchProjectQueryDto,
  ) {
    return this.projectService.searchProjects(params.user_id, query);
  }

  @Get(':user_id/:id')
  async getProjectById(@Param() params: ProjectScopedIdParamDto) {
    return this.projectService.getProjectById(params.id, params.user_id);
  }

  @Patch(':user_id/:id')
  async updateProject(
    @Param() params: ProjectScopedIdParamDto,
    @Body() body: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(params.id, params.user_id, body);
  }

  @Delete(':user_id/:id')
  async deleteProject(@Param() params: ProjectScopedIdParamDto) {
    return this.projectService.deleteProject(params.id, params.user_id);
  }
}
