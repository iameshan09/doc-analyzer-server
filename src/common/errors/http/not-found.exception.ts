import { ExceptionType } from 'src/common/enum/exceptions/exception_type.enum';
import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class NotFoundException extends BaseException {
  constructor(message: string, type: string = ExceptionType.NOT_FOUND) {
    super(message, type, HttpStatus.NOT_FOUND);
  }
}
