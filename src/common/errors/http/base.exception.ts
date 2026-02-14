// base-exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
    constructor(
        message: string,
        public type: string,
        status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    ) {
        super({ message, type }, status);
    }
}
