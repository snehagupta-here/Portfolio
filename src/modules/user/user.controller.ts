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

import { SearchUserQueryDto, UpdateUserDto, UserDto } from 'src/dto';

import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: UserDto) {
    return await this.userService.createUser(body);
  }

  @Get()
  async findAll() {
    return await this.userService.getAllUsers();
  }

  @Get('search')
  async search(@Query() query: SearchUserQueryDto) {
    return await this.userService.searchUsers(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.userService.updateUser(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
