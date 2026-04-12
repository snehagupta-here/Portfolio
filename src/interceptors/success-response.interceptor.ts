import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SuccessResponse } from 'src/interfaces/api-response.interface';

type ExistingSuccessResponse<T> = Partial<SuccessResponse<T>> &
  Record<string, unknown> & {
    success: true;
  };

function isExistingSuccessResponse<T>(
  value: unknown,
): value is ExistingSuccessResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    value.success === true
  );
}

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<
  T,
  T | SuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T> | T> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      map((data: T): SuccessResponse<T> | T => {
        const statusCode =
          typeof response.statusCode === 'number'
            ? response.statusCode
            : HttpStatus.OK;
        const timeStamp = new Date().toISOString();
        const path = request.originalUrl || request.url;

        if (isExistingSuccessResponse<T>(data)) {
          return {
            ...data,
            success: true,
            statusCode: data.statusCode ?? statusCode,
            message:
              typeof data.message === 'string'
                ? data.message
                : 'Request successful',
            timeStamp:
              typeof data.timeStamp === 'string' ? data.timeStamp : timeStamp,
            path: typeof data.path === 'string' ? data.path : path,
          };
        }

        return {
          success: true,
          statusCode,
          message: 'Request successful',
          data,
          timeStamp,
          path,
        };
      }),
    );
  }
}
