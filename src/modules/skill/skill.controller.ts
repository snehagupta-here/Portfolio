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

import { SearchSkillQueryDto, SkillDto, UpdateSkillDto } from 'src/dto';

import { SkillService } from './skill.service';

@Controller('api/v1/skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  async create(@Body() body: SkillDto) {
    return await this.skillService.createSkill(body);
  }

  @Get()
  async findAll() {
    return await this.skillService.getAllSkills();
  }

  @Get('search')
  async search(@Query() query: SearchSkillQueryDto) {
    return await this.skillService.searchSkills(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.skillService.getSkillById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateSkillDto) {
    return await this.skillService.updateSkill(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.skillService.deleteSkill(id);
  }
}
