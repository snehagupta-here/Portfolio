import { BadRequestException, NotFoundException } from '@nestjs/common';

export class InvalidProjectIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid project id',
      error: 'Bad Request',
    });
  }
}

export class ProjectNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'Project not found',
      error: 'Not Found',
    });
  }
}
