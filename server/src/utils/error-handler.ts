import { InternalServerErrorException } from '@nestjs/common';

export const handleError = (error: unknown, message: string): never => {
  if (error instanceof Error) {
    throw new InternalServerErrorException(
      `${message}: ${error.message}`,
    );
  }

  throw new InternalServerErrorException(message);
};