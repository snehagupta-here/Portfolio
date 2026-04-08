import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export class CloudinaryFolderRequiredException extends BadRequestException {
  constructor() {
    super({
      message: 'Folder path is required',
      error: 'Bad Request',
    });
  }
}

export class CloudinaryInvalidImageCountException extends BadRequestException {
  constructor(maxUploadCount: number) {
    super({
      message: `Image count must be an integer between 1 and ${maxUploadCount}`,
      error: 'Bad Request',
    });
  }
}

export class CloudinaryConfigurationMissingException extends InternalServerErrorException {
  constructor() {
    super({
      message: 'Cloudinary environment variables are missing',
      error: 'Internal Server Error',
    });
  }
}

export class CloudinarySignedUploadGenerationException extends InternalServerErrorException {
  constructor() {
    super({
      message: 'Failed to generate signed upload URLs',
      error: 'Internal Server Error',
    });
  }
}
