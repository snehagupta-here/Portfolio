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
  AchievementScopedIdParamDto,
  AchievementDto,
  AchievementUserParamDto,
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

  @Get(':user_id')
  async findAll(@Param() params: AchievementUserParamDto) {
    return await this.achievementService.getAllAchievements(params.user_id);
  }

  @Get(':user_id/search')
  async search(
    @Param() params: AchievementUserParamDto,
    @Query() query: SearchAchievementQueryDto,
  ) {
    return await this.achievementService.searchAchievements(
      params.user_id,
      query,
    );
  }

  @Get(':user_id/:id')
  async findOne(@Param() params: AchievementScopedIdParamDto) {
    return await this.achievementService.getAchievementById(
      params.id,
      params.user_id,
    );
  }

  @Patch(':user_id/:id')
  async update(
    @Param() params: AchievementScopedIdParamDto,
    @Body() body: UpdateAchievementDto,
  ) {
    return await this.achievementService.updateAchievement(
      params.id,
      params.user_id,
      body,
    );
  }

  @Delete(':user_id/:id')
  async remove(@Param() params: AchievementScopedIdParamDto) {
    return await this.achievementService.deleteAchievement(
      params.id,
      params.user_id,
    );
  }
}
