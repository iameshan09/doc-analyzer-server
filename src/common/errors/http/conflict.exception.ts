import { ExceptionType } from 'src/common/enum/exceptions/exception_type.enum';
import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class ConflictException extends BaseException {
  constructor(message: string, type: string = ExceptionType.CONFLICT) {
    super(message, type, HttpStatus.CONFLICT);
  }
}
