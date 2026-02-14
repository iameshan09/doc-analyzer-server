import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import FileUploadLogService from './file-upload-log.service';
import FileUploadLogStatus from '../enum/file-upload-log-status.enum';
import { WinstonLoggerService } from './winston-logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
class S3Service {
  private s3: S3Client;
  private region = 'us-east-1';
  private bucketName: string;
  constructor(
    private readonly fileUploadLogService: FileUploadLogService,
    private readonly loggerService: WinstonLoggerService,
    private readonly config: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: this.region,
    });
    this.bucketName = this.config.getOrThrow('S3_BUCKET');
  }

  async uploadSingle(
    Key: string,
    Body: Buffer,
    Bucket = this.bucketName,
  ): Promise<PutObjectCommandOutput> {
    let status: FileUploadLogStatus = FileUploadLogStatus.PROCESSING;
    try {
      const putObjectCommand = new PutObjectCommand({
        Body,
        Bucket,
        Key,
      });

      const result = await this.s3.send(putObjectCommand);

      if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Uploading ${Key} to S3 Bucket: ${Bucket} failed`);
      }
      status = FileUploadLogStatus.SUCCESS;
      return result;
    } catch (error) {
      status = FileUploadLogStatus.FAILED;
      throw error;
    } finally {
      this.fileUploadLogService
        .createLog(Key, Body, status)
        .then((e) =>
          this.loggerService.log(`File Upload log created: ${e.file_path}`),
        )
        .catch((error) =>
          this.loggerService.error(
            `File Upload log creation failed: ${error?.message || error}`,
          ),
        );
    }
  }
}
export default S3Service;
