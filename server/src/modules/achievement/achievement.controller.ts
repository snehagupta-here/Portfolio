import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementDto } from 'src/dto';


@Controller('achievement')
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.achievementService.getAchievementById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
      @Body() body: Partial<AchievementDto>,
  ) {
    return await this.achievementService.updateAchievement(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.achievementService.deleteAchievement(id);
  }
}