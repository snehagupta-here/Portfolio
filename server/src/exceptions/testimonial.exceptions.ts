import { BadRequestException, NotFoundException } from '@nestjs/common';

export class InvalidTestimonialUserIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid user_id',
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

export class TestimonialNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'Testimonial not found',
      error: 'Not Found',
    });
  }
}
