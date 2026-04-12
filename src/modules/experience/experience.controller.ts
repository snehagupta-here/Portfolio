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
  ExperienceDto,
  SearchExperienceQueryDto,
  UpdateExperienceDto,
} from 'src/dto';

import { ExperienceService } from './experience.service';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  async create(@Body() body: ExperienceDto) {
    return await this.experienceService.createExperience(body);
  }

  @Get()
  async findAll() {
    return await this.experienceService.getAllExperiences();
  }

  @Get('search')
  async search(@Query() query: SearchExperienceQueryDto) {
    return await this.experienceService.searchExperiences(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.experienceService.getExperienceById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateExperienceDto) {
    return await this.experienceService.updateExperience(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.experienceService.deleteExperience(id);
  }
}
