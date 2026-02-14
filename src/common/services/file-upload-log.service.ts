import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FileUploadLog } from '../schemas/file-upload-log.schema';
import FileUploadLogStatus from '../enum/file-upload-log-status.enum';
import CryptoService from './crypto.service';

@Injectable()
class FileUploadLogService {
  constructor(
    @InjectModel(FileUploadLog.name)
    private readonly model: Model<FileUploadLog>,
    private readonly cryptoService: CryptoService,
  ) {}

  async createLog(
    filePath: string,
    buffer: Buffer,
    status = FileUploadLogStatus.INITIATED,
  ) {
    const sha256 = this.cryptoService.hashBuffer(buffer);
    const model = new this.model({
      sha256,
      file_path: filePath,
      status,
    });
    return model.save();
  }

  async findLogBySha256(sha256: string) {
    return this.model.findOne({
      sha256,
    });
  }

  async updateStatus(id: Types.ObjectId | string, status: FileUploadLogStatus) {
    return this.model.findByIdAndUpdate(id, {
      $set: {
        status,
      },
    });
  }

  //   async findByFilePathAndThrow(filePath: string) {
  //     const result = await this.model.findOne({ file_path: filePath });
  //     if (result)
  //       throw new BadRequestException(
  //         `a record from file_path '${filePath}' already exist`,
  //       );
  //   }

  //   async findByIdentifierOrThrow(filePath: string) {
  //     const result = await this.model.findOne({
  //       file_path: filePath,
  //     });
  //     if (!result) throw new NotFoundException('file upload log not found');
  //     return result;
  //   }

  //   async findByidOrThrow(id: string | Types.ObjectId) {
  //     const result = await this.model.findById(id);
  //     if (!result) throw new NotFoundException('file upload log not found');
  //     return result;
  //   }
}

export default FileUploadLogService;
