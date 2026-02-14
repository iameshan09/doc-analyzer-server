import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import BaseUserCredentialsDto from '../common/dto/base-user-credentials.dto';
import UserAccountHelperService from 'src/common/services/user-account.helper.service';
import {
  UserAccount,
  UserAccountDocument,
} from 'src/common/schemas/user-accout.schema';
import SignInResponse from 'src/common/types/sign-in-response';
import { UserStatus } from 'src/common/enum/user.enums';
import * as bcrypt from 'bcryptjs';
import { UserSessionHelperService } from 'src/common/services/user-session-helper.service';
import CustomJwtPayload from 'src/common/types/custom-jwt-payload';
import { JwtService } from '@nestjs/jwt';
import ClientUserSession from 'src/common/types/client-user-session.interface';
import BaseUserDto from '../common/dto/base-user.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import EmailVerificationJwtPayload from 'src/common/types/email-verification-jwt-payload';
import TNodeEnv from 'src/common/types/node.env.types';
import { InjectQueue } from '@nestjs/bull';
import APP_QUEUE_NAMES from 'src/common/constants/app-queue-names';
import type { Queue } from 'bull';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import mailSubjects from 'src/common/constants/mail.subjects';
import mailTemplates from 'src/common/constants/mail.templates';
import jwtExpirations from 'src/common/constants/jwt-expirations';
import { MongoPlainJsObject } from 'src/common/types/mongoose.types';
import mailSenders from 'src/common/constants/mail.senders';

@Injectable()
export class UserAccountService {
  private rounds: number;
  private nodeEnv: TNodeEnv;
  private port: number;
  private appBaseUrl?: string;
  private adminClientAppBaseUrl: string;
  constructor(
    private readonly helperService: UserAccountHelperService,
    private readonly userSessionHelper: UserSessionHelperService,
    private readonly jwtService: JwtService,
    @InjectModel(UserAccount.name) private readonly model: Model<UserAccount>,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly configService: ConfigService,
    @InjectQueue(APP_QUEUE_NAMES.mailerQ)
    private readonly mailQ: Queue<ISendMailOptions>,
  ) {
    this.rounds = this.configService.get<number>(
      'BCRYPT_SALT_ROUNDS',
    ) as number;
    this.nodeEnv = this.configService.get<TNodeEnv>('NODE_ENV') as TNodeEnv;
    this.port = this.configService.get<number>('PORT') as number;
    this.appBaseUrl = this.configService.get<string>('APP_BASEURL');
    this.adminClientAppBaseUrl = this.configService.get<string>(
      'ADMIN_CLIENT_APP_BASEURL',
    ) as string;
  }

  private async validateAccountAndCredentials(
    user: UserAccountDocument,
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
    user: UserAccountDocument,
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

  async create(body: BaseUserDto) {
    await this.helperService.findByEmailAndThrow(body.email);
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const salt = await bcrypt.genSalt(this.rounds);
      const password = await bcrypt.hash(body.password, salt);
      const model = new this.model({
        ...body,
        password,
      });
      await model.save({ session });
      await this.buildAndSendAccountVerificationEmail(model);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async buildAndSendAccountVerificationEmail(user: UserAccountDocument) {
    const payload: EmailVerificationJwtPayload = {
      sub: user.email,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: jwtExpirations.accountVerification,
    });
    const appBaseUrl =
      this.nodeEnv === 'development'
        ? `http://localhost:${this.port}`
        : this.appBaseUrl;
    const href = `${appBaseUrl}/api/user-account/verify/?token=${token}`;
    await this.mailQ.add({
      to: user.email,
      subject: mailSubjects.accountVerification,
      template: mailTemplates.accountVerification,
      context: {
        recipient: user.firstName,
        href,
        from: mailSenders.default,
      },
    });
  }

  async verify(user: MongoPlainJsObject<UserAccount>) {
    const userAccount = await this.helperService.findByIdOrThrow(user._id);
    userAccount.status = UserStatus.ACTIVE;
    await userAccount.save();
    return this.adminClientAppBaseUrl;
  }
}
