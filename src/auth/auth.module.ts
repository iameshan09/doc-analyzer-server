import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import AuthService from './auth.service';
import { CustomJwtStrategy } from './strategies/custom-jwt.strategy';
import { AccountVerificationJwtStrategy } from './strategies/account-verification-jwt.strategy';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [AuthService, CustomJwtStrategy, AccountVerificationJwtStrategy],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
