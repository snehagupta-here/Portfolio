import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillDto } from 'src/dto';

@Controller('skill')
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.skillService.getSkillById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<SkillDto>,
  ) {
    return await this.skillService.updateSkill(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.skillService.deleteSkill(id);
  }
}