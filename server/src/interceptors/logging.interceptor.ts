import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { AppLogger } from 'src/common/app.logger';
import { AppRequest } from 'src/middleware/request-context.middleware';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  const message =
    typeof error === 'object' && error !== null
      ? (error as { message?: unknown }).message
      : error;

  if (typeof message === 'string') {
    return message;
  }

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return 'Unknown error';
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<AppRequest & Request>();
    const response = http.getResponse<Response>();
    const method = request.method;
    const url = request.originalUrl || request.url;
    const ip = request.clientIp ?? request.ip ?? request.socket.remoteAddress;
    const startedAt = request.startTime ?? Date.now();

    this.logger.log(
      `[Incoming] ${method} ${url} | IP: ${ip ?? 'unknown'}`,
      LoggingInterceptor.name,
    );

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `[Success] ${method} ${url} | ${response.statusCode} | ${Date.now() - startedAt}ms`,
          LoggingInterceptor.name,
        );
      }),
      catchError((error: unknown) => {
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = getErrorMessage(error);
        const trace = error instanceof Error ? error.stack : undefined;

        this.logger.error(
          `[Failed] ${method} ${url} | ${statusCode} | ${Date.now() - startedAt}ms | Error: ${message}`,
          trace,
          LoggingInterceptor.name,
        );

        return throwError(() => error);
      }),
    );
  }
}
