import { BadRequestException, NotFoundException } from '@nestjs/common';

export class BlogSlugAlreadyExistsException extends BadRequestException {
  constructor() {
    super({
      message: 'Slug already exists',
      error: 'Bad Request',
    });
  }
}

export class InvalidBlogIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid blog ID',
      error: 'Bad Request',
    });
  }
}

export class BlogNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'Blog not found',
      error: 'Not Found',
    });
  }
}
