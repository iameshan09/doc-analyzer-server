import {
  FileTypeValidator,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { DEFAULT_MAX_SIZE } from '../constants/file-sizes';

@Injectable()
export class SingleFileValidationPipe extends ParseFilePipe {
  constructor(
    fileType: string | RegExp,
    maxSize: number = DEFAULT_MAX_SIZE,
    required: boolean = true,
  ) {
    super({
      validators: [
        new MaxFileSizeValidator({
          maxSize,
          message: `File size exceeds the limit of ${maxSize / 1024 / 1024}MB`,
        }),
        new FileTypeValidator({ fileType }),
      ],
      fileIsRequired: required,
    });
  }
}
