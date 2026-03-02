import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SingleFileValidationPipe } from 'src/common/pipes/single-file-validation.pipe';
import { ANALYSIS_DOC_MAX_SIZE } from 'src/common/constants/file-sizes';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly service: AnalysisService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageFile(
    @UploadedFile(new SingleFileValidationPipe('pdf', ANALYSIS_DOC_MAX_SIZE))
    file: Express.Multer.File,
  ) {
    return this.service.analyse(file);
  }
}
