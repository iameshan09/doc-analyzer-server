import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserStatus } from '../enum/user.enums';
import {
  CN_ADMIN_ACCOUNTS,
  CN_USER_ACCOUNTS,
} from '../constants/collection.names';

// Hydrated document type for BaseUser
export type AdminAccountDocument = HydratedDocument<AdminAccount>;

// Base user schema with common user properties
@Schema({ timestamps: true, collection: CN_ADMIN_ACCOUNTS })
export class AdminAccount {
  // User's first name with length validation
  @Prop({ required: true, trim: true, maxlength: 50 })
  firstName: string;

  // User's last name with length validation
  @Prop({ required: true, trim: true, maxlength: 50 })
  lastName: string;

  // Unique email address in lowercase format
  @Prop({
    trim: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({ enum: UserStatus, default: UserStatus.INITIATED })
  status: string;

  @Prop()
  password?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const AdminAccountSchema = SchemaFactory.createForClass(AdminAccount);
