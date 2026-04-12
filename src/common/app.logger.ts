import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class AppLogger extends ConsoleLogger {
  log(message: string, context?: string): void {
    super.log(message, context ?? 'App');
  }

  error(message: string, trace?: string, context?: string): void {
    super.error(message, trace, context ?? 'App');
  }

  warn(message: string, context?: string): void {
    super.warn(message, context ?? 'App');
  }

  debug(message: string, context?: string): void {
    super.debug(message, context ?? 'App');
  }

  verbose(message: string, context?: string): void {
    super.verbose(message, context ?? 'App');
  }
}
