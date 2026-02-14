import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { ExceptionType } from '../enum/exceptions/exception_type.enum';
import { WinstonLoggerService } from '../services/winston-logger.service';
import customErrors from '../constants/custom-errors';

/**
 * Global exception filter for handling HTTP errors
 */
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}
  catch(exception: any, host: ArgumentsHost) {
    /** Log exception for debugging */
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status: number;

    if (exception) {
      /** Set status code based on exception type */
      status = [customErrors.invalidToken, customErrors.tokenExpired].includes(
        exception.name,
      )
        ? 401 // Authentication errors
        : typeof exception?.getStatus === 'function'
          ? exception.getStatus()
          : 502; // Default server error
    } else {
      status = 502;
    }

    /** Send formatted error response */
    response.status(status).json(
      exception instanceof ThrottlerException
        ? {
            message: exception?.message,
            type: ExceptionType.TOO_MANY_REQUESTS,
          }
        : typeof exception?.getResponse === 'function'
          ? exception.getResponse()
          : {
              message: exception?.message,
              error: exception?.name,
              statusCode: status,
            },
    );
  }
}
