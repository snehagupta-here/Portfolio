import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ExperienceDto } from 'src/dto';

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.experienceService.getExperienceById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<ExperienceDto>,
  ) {
    return await this.experienceService.updateExperience(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.experienceService.deleteExperience(id);
  }
}