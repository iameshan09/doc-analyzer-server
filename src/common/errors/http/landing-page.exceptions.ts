import LandingPageExceptionType from 'src/common/enum/exceptions/landing-page-exception-type.enum';
import { InternalErrorException } from './internal-error.exception';

export class LandignPageInvalidContentFormatException extends InternalErrorException {
  constructor(message: string) {
    super(message, LandingPageExceptionType.INVALID_CONTENT_FORMAT);
  }
}
