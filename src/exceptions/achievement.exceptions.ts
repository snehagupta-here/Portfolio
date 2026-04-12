import { BadRequestException, NotFoundException } from '@nestjs/common';

export class InvalidAchievementUserIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid user_id',
      error: 'Bad Request',
    });
  }
}

export class AchievementUserNotFoundException extends BadRequestException {
  constructor() {
    super({
      message: 'User not found',
      error: 'Bad Request',
    });
  }
}

export class AchievementAlreadyExistsException extends BadRequestException {
  constructor() {
    super({
      message: 'Achievement already exists',
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

export class AchievementSearchQueryRequiredException extends BadRequestException {
  constructor() {
    super({
      message:
        'At least one of user_id, title, competition_name, or position query parameter is required',
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
