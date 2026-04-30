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
  ExperienceScopedIdParamDto,
  ExperienceDto,
  ExperienceUserParamDto,
  SearchExperienceQueryDto,
  UpdateExperienceDto,
} from 'src/dto';

import { ExperienceService } from './experience.service';

@Controller('api/v1/experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  async create(@Body() body: ExperienceDto) {
    return await this.experienceService.createExperience(body);
  }

  @Get(':user_id')
  async findAll(@Param() params: ExperienceUserParamDto) {
    return await this.experienceService.getAllExperiences(params.user_id);
  }

  @Get(':user_id/search')
  async search(
    @Param() params: ExperienceUserParamDto,
    @Query() query: SearchExperienceQueryDto,
  ) {
    return await this.experienceService.searchExperiences(
      params.user_id,
      query,
    );
  }

  @Get(':user_id/:id')
  async findOne(@Param() params: ExperienceScopedIdParamDto) {
    return await this.experienceService.getExperienceById(
      params.id,
      params.user_id,
    );
  }

  @Patch(':user_id/:id')
  async update(
    @Param() params: ExperienceScopedIdParamDto,
    @Body() body: UpdateExperienceDto,
  ) {
    return await this.experienceService.updateExperience(
      params.id,
      params.user_id,
      body,
    );
  }

  @Delete(':user_id/:id')
  async remove(@Param() params: ExperienceScopedIdParamDto) {
    return await this.experienceService.deleteExperience(
      params.id,
      params.user_id,
    );
  }
}
