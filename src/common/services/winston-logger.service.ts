import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import chalk from 'chalk';

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService implements LoggerService {
  private logger: Logger;
  private ctx?: string;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'MM/DD/YYYY, HH:mm:ss.SSS' }),
        format.printf((info) => {
          return `[Winston ${process.pid} ${chalk.whiteBright(info.timestamp)} ${info.level.toUpperCase()} ${chalk.yellow(`[${this.ctx || 'Application'}]`)} ${info.message}]`;
        }),
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.timestamp(),
            format.colorize({
              all: true,
            }),
          ),
        }),
        // Add other transport here
      ],
    });
  }

  setContext(ctx: string): void {
    this.ctx = ctx;
  }

  log(message: string, context?: string): void {
    this.logger.log({ level: 'info', message, context });
  }

  error(message: string, optionalParams?: any): void {
    this.logger.log({ level: 'error', message: `${message}` });
  }

  warn(message: string, context?: string): void {
    this.logger.log({ level: 'warn', message, context });
  }

  debug(message: string, context?: string): void {
    this.logger.log({ level: 'debug', message, context });
  }

  verbose(message: string, context?: string): void {
    this.logger.log({ level: 'verbose', message, context });
  }
}
