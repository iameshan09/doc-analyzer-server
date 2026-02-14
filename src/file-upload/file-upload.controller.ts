import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { Public } from 'src/common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import UploadFileDto from './dto/upload.file.dto';
import { SingleFileValidationPipe } from 'src/common/pipes/single-file-validation.pipe';
import { DEFAULT_MAX_SIZE } from 'src/common/constants/file-sizes';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly service: FileUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageFile(
    @Body() body: UploadFileDto,
    @UploadedFile(new SingleFileValidationPipe('image/*', DEFAULT_MAX_SIZE))
    file: Express.Multer.File,
  ) {
    return this.service.uploadImageFile(file, body);
  }
}
