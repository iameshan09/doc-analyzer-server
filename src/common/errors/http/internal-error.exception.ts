import { ExceptionType } from 'src/common/enum/exceptions/exception_type.enum';
import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class InternalErrorException extends BaseException {
  constructor(message: string, type: string = ExceptionType.INTERNAL_ERROR) {
    super(message, type, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
