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

import { BlogDto, SearchBlogQueryDto, UpdateBlogDto } from 'src/dto';

import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body() body: BlogDto) {
    return await this.blogService.createBlog(body);
  }

  @Get()
  async findAll() {
    return await this.blogService.getAllBlogs();
  }

  @Get('search')
  async search(@Query() query: SearchBlogQueryDto) {
    return await this.blogService.searchBlogs(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.blogService.getBlogById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateBlogDto) {
    return await this.blogService.updateBlog(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.blogService.deleteBlog(id);
  }
}
