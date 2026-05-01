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
  BlogDto,
  BlogScopedIdParamDto,
  BlogUserParamDto,
  SearchBlogQueryDto,
  UpdateBlogDto,
} from 'src/dto';

import { BlogService } from './blog.service';

@Controller('api/v1/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post(':user_id')
  async create(@Param() params: BlogUserParamDto, @Body() body: BlogDto) {
    return await this.blogService.createBlog(params.user_id, body);
  }

  @Get(':user_id')
  async findAll(@Param() params: BlogUserParamDto) {
    return await this.blogService.getAllBlogs(params.user_id);
  }

  @Get(':user_id/search')
  async search(
    @Param() params: BlogUserParamDto,
    @Query() query: SearchBlogQueryDto,
  ) {
    return await this.blogService.searchBlogs(params.user_id, query);
  }

  @Get(':user_id/:id')
  async findOne(@Param() params: BlogScopedIdParamDto) {
    return await this.blogService.getBlogById(params.id, params.user_id);
  }

  @Patch(':user_id/:id')
  async update(
    @Param() params: BlogScopedIdParamDto,
    @Body() body: UpdateBlogDto,
  ) {
    return await this.blogService.updateBlog(params.id, params.user_id, body);
  }

  @Delete(':user_id/:id')
  async remove(@Param() params: BlogScopedIdParamDto) {
    return await this.blogService.deleteBlog(params.id, params.user_id);
  }
}
