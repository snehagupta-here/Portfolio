import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/dto';

@Controller('user')
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<UserDto>,
  ) {
    return await this.userService.updateUser(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}