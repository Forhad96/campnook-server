import { Model } from 'mongoose';
import { USER_ROLES } from './user.constant';

export interface TUser {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt: Date;
  role: 'superAdmin' | 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserStaticModel extends Model<TUser> {
  isUserExisTByCustomId(id: string): Promise<TUser>;

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
