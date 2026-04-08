import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export type AppRequest = Request & {
  startTime?: number;
  clientIp?: string;
};

function extractForwardedIp(
  headerValue: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(headerValue)) {
    return headerValue[0]?.split(',')[0]?.trim();
  }

  return headerValue?.split(',')[0]?.trim();
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: AppRequest, _res: Response, next: NextFunction): void {
    req.startTime = Date.now();
    req.clientIp =
      extractForwardedIp(req.headers['x-forwarded-for']) ||
      req.ip ||
      req.socket.remoteAddress ||
      '';

    next();
  }
}
