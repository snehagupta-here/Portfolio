import { BadRequestException, NotFoundException } from '@nestjs/common';

export class InvalidTestimonialUserIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid user_id',
      error: 'Bad Request',
    });
  }
}

export class TestimonialUserNotFoundException extends BadRequestException {
  constructor() {
    super({
      message: 'User not found',
      error: 'Bad Request',
    });
  }
}

export class TestimonialAlreadyExistsException extends BadRequestException {
  constructor() {
    super({
      message: 'Testimonial already exists',
      error: 'Bad Request',
    });
  }
}

export class InvalidTestimonialIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid testimonial ID',
      error: 'Bad Request',
    });
  }
}

export class TestimonialSearchQueryRequiredException extends BadRequestException {
  constructor() {
    super({
      message: 'Either user_id, name, or rating query parameter is required',
      error: 'Bad Request',
    });
  }
}

export class TestimonialNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'Testimonial not found',
      error: 'Not Found',
    });
  }
}
