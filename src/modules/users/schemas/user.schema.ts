import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum AccountType {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({
    default: null,
  })
  image?: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop({
    type: String,
    enum: AccountType,
    default: AccountType.LOCAL,
  })
  accountType: AccountType;

  @Prop({
    default: false,
  })
  isActive: boolean;

  // mã kích hoạt / reset password
  @Prop({
    default: null,
  })
  codeId?: string;

  @Prop({
    default: null,
  })
  codeExpired?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
