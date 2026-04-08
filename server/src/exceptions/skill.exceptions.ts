import { BadRequestException, NotFoundException } from '@nestjs/common';

export class SkillAlreadyExistsException extends BadRequestException {
  constructor() {
    super({
      message: 'Skill already exists',
      error: 'Bad Request',
    });
  }
}

export class InvalidSkillIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid skill ID',
      error: 'Bad Request',
    });
  }
}

export class SkillSearchQueryRequiredException extends BadRequestException {
  constructor() {
    super({
      message: 'Either name or category query parameter is required',
      error: 'Bad Request',
    });
  }
}

export class SkillNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'Skill not found',
      error: 'Not Found',
    });
  }
}
