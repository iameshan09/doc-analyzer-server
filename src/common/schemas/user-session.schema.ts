import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CN_NAME_USER_SESSION } from '../constants/collection.names';
import { SessionStatusEnum } from '../enum/sessions.enum';

export type UserSessionDocument = HydratedDocument<UserSession>;

@Schema({
  timestamps: true,
  collection: CN_NAME_USER_SESSION,
})
export class UserSession {
  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  ownership: Types.ObjectId;

  @Prop({
    enum: SessionStatusEnum,
    default: SessionStatusEnum.VALID,
  })
  status: SessionStatusEnum;

  @Prop({ trim: true })
  fcm?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
