import CCExceptionType from 'src/common/enum/exceptions/cc-exception-type.enum';
import { InternalErrorException } from './internal-error.exception';

class CCDefaultException extends InternalErrorException {
  constructor(message: string) {
    super(message, CCExceptionType.DEFAULT);
  }
}

export class CCInvalidContentFormatException extends InternalErrorException {
  constructor(message: string) {
    super(message, CCExceptionType.INVALID_CONTENT_FORMAT);
  }
}

export { CCDefaultException };
