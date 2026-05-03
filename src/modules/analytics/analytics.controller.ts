import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('api/v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}
  @Get('/profile-data/:user_id')
  async profileDataCount(@Param() params: { user_id: string }) {
    return await this.analyticsService.profileDataCount(params.user_id);
  }
  @Get('/insights/:user_id')
  async insights(@Param() params: { user_id: string }) {
    return await this.analyticsService.insights(params.user_id);
  }
  @Get('/recent-data/:user_id')
  async recentData(@Param() params: { user_id: string }) {
    return await this.analyticsService.recentData(params.user_id);
  }
}
