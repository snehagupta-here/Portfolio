import { Body, Controller, Post } from '@nestjs/common';

import { AuthLoginDto, AuthRegisterDto } from 'src/dto';

import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: AuthRegisterDto) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: AuthLoginDto) {
    return await this.authService.login(body);
  }
}
