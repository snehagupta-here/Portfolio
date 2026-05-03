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
  SearchTestimonialQueryDto,
  TestimonialScopedIdParamDto,
  TestimonialDto,
  TestimonialUserParamDto,
  UpdateTestimonialDto,
} from 'src/dto';

import { TestimonialService } from './testimonial.service';

@Controller('api/v1/testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post(':user_id')
  async createTestimonial(
    @Param() params: TestimonialUserParamDto,
    @Body() body: TestimonialDto,
  ) {
    return await this.testimonialService.addTestimonial(params.user_id, body);
  }

  @Get(':user_id')
  async getAllTestimonials(@Param() params: TestimonialUserParamDto) {
    return await this.testimonialService.getAllTestimonials(params.user_id);
  }

  @Get(':user_id/search')
  async searchTestimonials(
    @Param() params: TestimonialUserParamDto,
    @Query() query: SearchTestimonialQueryDto,
  ) {
    return await this.testimonialService.searchTestimonials(
      params.user_id,
      query,
    );
  }

  @Get(':user_id/:id')
  async getTestimonialById(@Param() params: TestimonialScopedIdParamDto) {
    return await this.testimonialService.getTestimonialById(
      params.id,
      params.user_id,
    );
  }

  @Patch(':user_id/:id')
  async updateTestimonial(
    @Param() params: TestimonialScopedIdParamDto,
    @Body() body: UpdateTestimonialDto,
  ) {
    return await this.testimonialService.updateTestimonial(
      params.id,
      params.user_id,
      body,
    );
  }

  @Delete(':user_id/:id')
  async deleteTestimonial(@Param() params: TestimonialScopedIdParamDto) {
    return await this.testimonialService.deleteTestimonial(
      params.id,
      params.user_id,
    );
  }
}
