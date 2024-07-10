import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await UserModel.isUserExisTByCustomId(payload?.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exist');
  }

  //checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }
  //checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked');
  }

  //checking if the password correct
  const isMatched = await UserModel.isPasswordMatched(
    payload?.password,
    user?.password,
  );
  if (!isMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }
  //create token send to the client

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expired_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expired_in as string,
  );
  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const { userId, role } = userData;

  // checking if the user is exist
  const user = await UserModel.isUserExisTByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exist');
  }

  //checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }
  //checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked');
  }

  //checking if the password correct
  const isMatched = await UserModel.isPasswordMatched(
    payload?.oldPassword,
    user?.password,
  );
  if (!isMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await UserModel.findOneAndUpdate(
    {
      id: userId,
      role: role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token valid or not
  const decoded = verifyToken(token, config.jwt_access_secret as string);

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await UserModel.isUserExisTByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exist');
  }

  //checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }
  //checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked');
  }

  if (
    user.passwordChangedAt &&
    UserModel.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  //create token send to the client

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expired_in as string,
  );

  return {
    accessToken,
  };
};

const forgotPassword = async (userId: string) => {
  const user = await UserModel.isUserExisTByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exist');
  }

  //checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }
  //checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked');
  }

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetLink = `${config.reset_pass_uri_link}?id=${user?.id}&token=${refreshToken}`;
  sendEmail(user.email, resetLink);
  return resetLink;
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await UserModel.isUserExisTByCustomId(payload?.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exist');
  }

  //checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }
  //checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked');
  }
  // checking if the given token valid or not
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await UserModel.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};


export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,

};
