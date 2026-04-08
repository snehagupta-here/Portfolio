import { InternalServerErrorException } from '@nestjs/common';

export class ContactUsSubmissionFailedException extends InternalServerErrorException {
  constructor(reason?: string) {
    super({
      message: reason
        ? `Failed to insert contact us data: ${reason}`
        : 'Failed to insert contact us data',
      error: 'Internal Server Error',
    });
  }
}
