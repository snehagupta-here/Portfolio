import { BadRequestException } from '@nestjs/common';

export class AnalyticsUserNotFoundException extends BadRequestException {
  constructor() {
    super({
      message: 'User not found',
      error: 'Bad Request',
    });
  }
}
