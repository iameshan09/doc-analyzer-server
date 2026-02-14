import { ExceptionType } from 'src/common/enum/exceptions/exception_type.enum';
import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class GoneException extends BaseException {
  constructor(message: string, type: string = ExceptionType.GONE) {
    super(message, type, HttpStatus.GONE);
  }
}
