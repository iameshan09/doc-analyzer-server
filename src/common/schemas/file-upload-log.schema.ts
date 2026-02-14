import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import FileUploadLogStatus from '../enum/file-upload-log-status.enum';
import { CN_FILE_UPLOAD_LOGS } from '../constants/collection.names';

export type FileUploadLogDocument = HydratedDocument<FileUploadLog>;

@Schema({ timestamps: true, collection: CN_FILE_UPLOAD_LOGS })
export class FileUploadLog {
  @Prop({ required: true, trim: true })
  file_path: string;

  @Prop({ required: true, trim: true })
  sha256: string;

  @Prop({ enum: FileUploadLogStatus, default: FileUploadLogStatus.INITIATED })
  status: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const FileUploadLogSchema = SchemaFactory.createForClass(FileUploadLog);
