import { Model } from 'mongoose';
import { USER_ROLES } from './user.constant';

export interface TUser {
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt: Date;
  role: 'superAdmin' | 'admin' | 'user';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserStaticModel extends Model<TUser> {
  isUserExistByEmail(email: string): Promise<TUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRoles = keyof typeof USER_ROLES;
