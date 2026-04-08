import { BadRequestException, NotFoundException } from '@nestjs/common';

export class InvalidAchievementUserIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid user_id',
      error: 'Bad Request',
    });
  }
}

export class InvalidAchievementIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid achievement ID',
      error: 'Bad Request',
    });
  }
}

export class AchievementNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'Achievement not found',
      error: 'Not Found',
    });
  }
}
