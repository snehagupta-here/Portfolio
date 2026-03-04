import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogDto } from 'src/dto';

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.blogService.getBlogById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<BlogDto>,
  ) {
    return await this.blogService.updateBlog(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.blogService.deleteBlog(id);
  }
}