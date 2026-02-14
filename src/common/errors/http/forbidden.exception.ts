import { ExceptionType } from 'src/common/enum/exceptions/exception_type.enum';
import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class ForbiddenException extends BaseException {
  constructor(message: string, type: string = ExceptionType.FORBIDDEN) {
    super(message, type, HttpStatus.FORBIDDEN);
  }
}
