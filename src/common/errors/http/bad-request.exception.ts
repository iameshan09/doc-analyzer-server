import { ExceptionType } from 'src/common/enum/exceptions/exception_type.enum';
import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class BadRequestException extends BaseException {
  constructor(message: string, type: string = ExceptionType.BAD_REQUEST) {
    super(message, type, HttpStatus.BAD_REQUEST);
  }
}
