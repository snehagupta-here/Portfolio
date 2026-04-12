import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

const logger = new Logger('ErrorHandler');

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  if (typeof error === 'string') return error;

  return 'Unknown error';
};

export const handleError = (error: unknown, message: string): never => {
  const errorMessage = getErrorMessage(error);

  if (error instanceof HttpException) {
    logger.error(`${message}: ${errorMessage}`);
    throw error;
  }

  logger.error(`${message}: ${errorMessage}`);

  throw new InternalServerErrorException(`${message}: ${errorMessage}`);
};
