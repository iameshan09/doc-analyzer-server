import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthStrategyEnum } from 'src/common/enum/auth.enums';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export default class CustomJwtGuard extends AuthGuard(
  AuthStrategyEnum.CUSTOM_JWT,
) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
