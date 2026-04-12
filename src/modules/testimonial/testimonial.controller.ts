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
  TestimonialDto,
  UpdateTestimonialDto,
} from 'src/dto';

import { TestimonialService } from './testimonial.service';

@Controller('testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post()
  async createTestimonial(@Body() body: TestimonialDto) {
    return await this.testimonialService.addTestimonial(body);
  }

  @Get()
  async getAllTestimonials() {
    return await this.testimonialService.getAllTestimonials();
  }

  @Get('search')
  async searchTestimonials(@Query() query: SearchTestimonialQueryDto) {
    return await this.testimonialService.searchTestimonials(query);
  }

  @Get(':id')
  async getTestimonialById(@Param('id') id: string) {
    return await this.testimonialService.getTestimonialById(id);
  }

  @Patch(':id')
  async updateTestimonial(
    @Param('id') id: string,
    @Body() body: UpdateTestimonialDto,
  ) {
    return await this.testimonialService.updateTestimonial(id, body);
  }

  @Delete(':id')
  async deleteTestimonial(@Param('id') id: string) {
    return await this.testimonialService.deleteTestimonial(id);
  }
}
