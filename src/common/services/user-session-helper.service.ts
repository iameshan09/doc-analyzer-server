import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StringValue } from 'ms';
import {
  UserSession,
  UserSessionDocument,
} from 'src/common/schemas/user-session.schema';
import { SessionStatusEnum } from '../enum/sessions.enum';
import { getDeadline } from '../utils/date.utils';

/**
 * Helper service for user session management and validation
 */
@Injectable()
export class UserSessionHelperService {
  constructor(
    @InjectModel(UserSession.name)
    private readonly userSessionModel: Model<UserSession>,
  ) {}

  /** Get unique FCM-enabled sessions for push notifications */
  async getFCMsupportedSessions(
    ownership: Types.ObjectId,
    expireIn: StringValue,
  ) {
    return this.userSessionModel.aggregate<UserSessionDocument>([
      {
        $match: {
          ownership,
          status: SessionStatusEnum.VALID,
          createdAt: { $gt: getDeadline(expireIn) },
          fcm: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$fcm',
          doc: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$doc' },
      },
    ]);
  }

  /** Create new user session */
  async createNewSession(ownership: Types.ObjectId) {
    const model = new this.userSessionModel({
      ownership,
    });
    return model.save();
  }

  async getSessionOrNull(query: Types.ObjectId | Partial<UserSession>) {
    if (query instanceof Types.ObjectId) {
      return await this.userSessionModel.findById(query);
    }
    return await this.userSessionModel.findOne(query);
  }

  async updateSessionById(id: Types.ObjectId, update: Partial<UserSession>) {
    return this.userSessionModel.findByIdAndUpdate(id, update, { new: true });
  }

  async findByIdOrThrow(
    id: Types.ObjectId | string,
  ): Promise<UserSessionDocument> {
    const session = await this.userSessionModel.findById(id);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }

  async getValidSessionByIdOrThrow(
    id: Types.ObjectId | string,
    expireIn: StringValue,
  ) {
    const session = await this.userSessionModel.findById(id);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (session.status !== SessionStatusEnum.VALID) {
      throw new BadRequestException('Session is not valid');
    }
    if (
      new Date(session.createdAt).getTime() < getDeadline(expireIn).getTime()
    ) {
      throw new BadRequestException('Session is expired');
    }
    return session;
  }
}
