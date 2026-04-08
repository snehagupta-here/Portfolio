import { BadRequestException, NotFoundException } from '@nestjs/common';

export class InvalidExperienceUserIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid user_id',
      error: 'Bad Request',
    });
  }
}

export class ExperienceUserNotFoundException extends BadRequestException {
  constructor() {
    super({
      message: 'User not found',
      error: 'Bad Request',
    });
  }
}

export class ExperienceAlreadyExistsException extends BadRequestException {
  constructor() {
    super({
      message: 'Experience already exists',
      error: 'Bad Request',
    });
  }
}

export class InvalidExperienceIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid experience ID',
      error: 'Bad Request',
    });
  }
}

export class ExperienceNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'Experience not found',
      error: 'Not Found',
    });
  }
}
