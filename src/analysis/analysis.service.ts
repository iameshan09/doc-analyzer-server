import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalysisService {
  async analyse(file: Express.Multer.File) {
    // Placeholder for analysis logic
    return {
      message: 'File received and analysis started',
      fileName: file.originalname,
      fileSize: file.size,
    };
  }
}
