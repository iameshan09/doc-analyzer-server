import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserStatus } from 'src/common/enum/user.enums';
import AdminAccountHelperService from 'src/common/services/admin-account.helper.service';
import CustomJwtPayload from 'src/common/types/custom-jwt-payload';
import EmailVerificationJwtPayload from 'src/common/types/email-verification-jwt-payload';

@Injectable()
class AuthService {
  constructor(
    private readonly userAccountHelperService: AdminAccountHelperService,
  ) {}

  async validateUser(payload: CustomJwtPayload) {
    const user = await this.userAccountHelperService.findByIdOrThrow(
      payload.sub,
    );
    if (user.status !== (UserStatus.ACTIVE as string))
      throw new UnauthorizedException('User Account is not activated');

    return user.toObject();
  }

  async validateUserForAccountVerification(
    payload: EmailVerificationJwtPayload,
  ) {
    const user = await this.userAccountHelperService.findByEmailOrThrow(
      payload.sub,
    );
    if (user.status === (UserStatus.ACTIVE as string))
      throw new ConflictException('User Account is already activated');

    return user.toObject();
  }
}

export default AuthService;
