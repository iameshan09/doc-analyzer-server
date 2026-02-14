import { Injectable } from '@nestjs/common';
import FileUploadLogStatus from 'src/common/enum/file-upload-log-status.enum';
import CryptoService from 'src/common/services/crypto.service';
import FileUploadLogService from 'src/common/services/file-upload-log.service';
import S3Service from 'src/common/services/s3.service';
import UploadFileDto from './dto/upload.file.dto';
import { ConfigService } from '@nestjs/config';
import { srcBuilder } from 'src/common/utils/miscellaneous.lib';

@Injectable()
export class FileUploadService {
  private cloudFrontDistBaseUrl: string;
  constructor(
    private readonly s3Service: S3Service,
    private readonly fileUploadLogService: FileUploadLogService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
  ) {
    this.cloudFrontDistBaseUrl = this.configService.get<string>(
      'S3_BUCKET_PUBLIC_ACCESS_BASE_URL',
    ) as string;
  }

  async uploadImageFile(file: Express.Multer.File, body: UploadFileDto) {
    const sanitizedPathPrefix = body.pathPrefix.endsWith('/')
      ? body.pathPrefix.slice(0, -1)
      : body.pathPrefix;

    const sha256 = this.cryptoService.hashBuffer(file.buffer);

    const fileUploadLog =
      await this.fileUploadLogService.findLogBySha256(sha256);

    let Key: string;
    if (
      fileUploadLog &&
      fileUploadLog.status !== (FileUploadLogStatus.FAILED as string)
    ) {
      Key = fileUploadLog.file_path;
    } else {
      Key = `${sanitizedPathPrefix}/${file.originalname}`;
      await this.s3Service.uploadSingle(Key, file.buffer);
    }

    let value = Key;

    if (body.options?.full_url) {
      value = srcBuilder(Key, this.cloudFrontDistBaseUrl);
    }
    return value;
  }
}
