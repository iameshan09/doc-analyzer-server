import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthStrategyEnum } from 'src/common/enum/auth.enums';

@Injectable()
export default class AccountVerificationJwtGuard extends AuthGuard(
  AuthStrategyEnum.ACCOUT_VERIFICATION_JWT,
) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
