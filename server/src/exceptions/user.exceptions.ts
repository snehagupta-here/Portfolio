import { BadRequestException, NotFoundException } from '@nestjs/common';

export class InvalidUserIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid user ID',
      error: 'Bad Request',
    });
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'User not found',
      error: 'Not Found',
    });
  }
}
