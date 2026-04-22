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
  AchievementDto,
  SearchAchievementQueryDto,
  UpdateAchievementDto,
} from 'src/dto';

import { AchievementService } from './achievement.service';

@Controller('api/v1/achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  async create(@Body() body: AchievementDto) {
    return await this.achievementService.createAchievement(body);
  }

  @Get()
  async findAll() {
    return await this.achievementService.getAllAchievements();
  }

  @Get('search')
  async search(@Query() query: SearchAchievementQueryDto) {
    return await this.achievementService.searchAchievements(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.achievementService.getAchievementById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateAchievementDto) {
    return await this.achievementService.updateAchievement(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.achievementService.deleteAchievement(id);
  }
}
