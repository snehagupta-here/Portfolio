import { BadRequestException, NotFoundException } from '@nestjs/common';

export class ProjectSlugAlreadyExistsException extends BadRequestException {
  constructor() {
    super({
      message: 'Slug already exists',
      error: 'Bad Request',
    });
  }
}

export class InvalidProjectIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid project id',
      error: 'Bad Request',
    });
  }
}

export class ProjectSearchQueryRequiredException extends BadRequestException {
  constructor() {
    super({
      message: 'Either title, slug, or isActive query parameter is required',
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
