import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { mongooseModuleAsyncOptions } from './config/mongoose.config';
import validationSchema from './config/validation.schema';
import { BullModule } from '@nestjs/bull';
import sharedBullAsyncConfiguration from './config/shared-bull-async-config';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { DebugModule } from './debug/debug.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { UserAccountModule } from './user-account/user-account.module';
import CustomJwtGuard from './auth/guards/custom-jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from './config/jwt.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerAsyncOptions } from './config/mailer.config';
import { LandingPageModule } from './landing-page/landing-page.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttlerAsyncOptions } from './config/throttler.config';
import { CacheModule } from '@nestjs/cache-manager';
import { cacheModuleAsyncOptions } from './config/cache.config';
import { AppLoggerMiddleware } from './common/middleware/logger.middleware';
import { AdminAccountModule } from './admin-account/admin-account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    BullModule.forRootAsync(sharedBullAsyncConfiguration),
    JwtModule.registerAsync(jwtModuleAsyncOptions),
    MailerModule.forRootAsync(mailerAsyncOptions),
    ThrottlerModule.forRootAsync(throttlerAsyncOptions),
    CacheModule.registerAsync(cacheModuleAsyncOptions),
    CommonModule,
    AuthModule,
    DebugModule,
    FileUploadModule,
    UserAccountModule,
    LandingPageModule,
    AdminAccountModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomJwtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
