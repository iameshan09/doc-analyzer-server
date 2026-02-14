import { NotFoundException } from './not-found.exception';
import StoryExceptionType from 'src/common/enum/exceptions/story-exception-type.enum';
import { InternalErrorException } from './internal-error.exception';

export class StoryNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message, StoryExceptionType.NOT_FOUND);
  }
}

export class StoryInvalidContentFormatException extends InternalErrorException {
  constructor(message: string) {
    super(message, StoryExceptionType.INVALID_CONTENT_FORMAT);
  }
}

export class StoryIncompleteDataException extends InternalErrorException {
  constructor(message: string) {
    super(message, StoryExceptionType.INCOMPLETE_DATA);
  }
}

export class StoryNotActiveException extends InternalErrorException {
  constructor(message: string) {
    super(message, StoryExceptionType.NOT_ACTIVE);
  }
}

export class StoryInProcessingException extends InternalErrorException {
  constructor(message: string) {
    super(message, StoryExceptionType.IN_PROCESSING);
  }
}
