import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import S3Service from './services/s3.service';
import { BullModule } from '@nestjs/bull';
import APP_QUEUE_NAMES from './constants/app-queue-names';
import { WinstonLoggerService } from './services/winston-logger.service';
import {
  FileUploadLog,
  FileUploadLogSchema,
} from './schemas/file-upload-log.schema';
import FileUploadLogService from './services/file-upload-log.service';
import CryptoService from './services/crypto.service';
import { UserAccount, UserAccountSchema } from './schemas/user-accout.schema';
import UserAccountHelperService from './services/user-account.helper.service';
import { UserSession, UserSessionSchema } from './schemas/user-session.schema';
import { UserSessionHelperService } from './services/user-session-helper.service';
import MailerProcessor from './services/mailer.processor';
import {
  AdminAccount,
  AdminAccountSchema,
} from './schemas/admin-accout.schema';
import AdminAccountHelperService from './services/admin-account.helper.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileUploadLog.name, schema: FileUploadLogSchema },
      { name: UserAccount.name, schema: UserAccountSchema },
      { name: UserSession.name, schema: UserSessionSchema },
      { name: AdminAccount.name, schema: AdminAccountSchema },
    ]),
    BullModule.registerQueueAsync({
      name: APP_QUEUE_NAMES.mailerQ,
    }),
  ],
  controllers: [],
  providers: [
    //S3Service,
    WinstonLoggerService,
    FileUploadLogService,
    CryptoService,
    UserAccountHelperService,
    UserSessionHelperService,
    //MailerProcessor,
    AdminAccountHelperService,
  ],
  exports: [
    MongooseModule,
    //S3Service,
    BullModule,
    WinstonLoggerService,
    FileUploadLogService,
    CryptoService,
    UserAccountHelperService,
    UserSessionHelperService,
    AdminAccountHelperService,
  ],
})
export class CommonModule {}
