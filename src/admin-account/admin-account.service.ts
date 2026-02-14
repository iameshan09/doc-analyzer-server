import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import BaseUserCredentialsDto from 'src/common/dto/base-user-credentials.dto';
import { UserStatus } from 'src/common/enum/user.enums';
import { AdminAccountDocument } from 'src/common/schemas/admin-accout.schema';
import SignInResponse from 'src/common/types/sign-in-response';
import * as bcrypt from 'bcryptjs';
import { UserSessionHelperService } from 'src/common/services/user-session-helper.service';
import CustomJwtPayload from 'src/common/types/custom-jwt-payload';
import { JwtService } from '@nestjs/jwt';
import jwtExpirations from 'src/common/constants/jwt-expirations';
import ClientUserSession from 'src/common/types/client-user-session.interface';
import AdminAccountHelperService from 'src/common/services/admin-account.helper.service';

@Injectable()
export class AdminAccountService {
  constructor(
    private readonly userSessionHelper: UserSessionHelperService,
    private readonly helperService: AdminAccountHelperService,
    private readonly jwtService: JwtService,
  ) {}

  private async validateAccountAndCredentials(
    user: AdminAccountDocument,
    password: string,
  ) {
    if (user.status !== (UserStatus.ACTIVE as string)) {
      throw new UnauthorizedException('Account is not active');
    }

    if (!user.password) {
      throw new InternalServerErrorException('user.password undefined');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async getSignInResponse(
    user: AdminAccountDocument,
    credentials: BaseUserCredentialsDto,
  ): Promise<SignInResponse> {
    await this.validateAccountAndCredentials(user, credentials.password);
    const serverSession = await this.userSessionHelper.createNewSession(
      user._id,
    );
    const payload: CustomJwtPayload = {
      sub: user._id.toString(),
      sessionId: serverSession._id.toString(),
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: jwtExpirations.userSession,
    });
    const clientSession: ClientUserSession = {
      id: serverSession._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    return { session: clientSession, token };
  }

  async signIn(body: BaseUserCredentialsDto) {
    const user = await this.helperService.findByEmailOrThrow(body.email);

    return this.getSignInResponse(user, body);
  }
}
