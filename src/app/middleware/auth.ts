import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import catchAsync from '../utils/cathAsync';
import config from '../config';
import { TUserRoles } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';
// import { UserModel } from '../modules/user/user.model';

const auth = (...requiredUserRoles: TUserRoles[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token valid or not
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const {userId,role,iat} = decoded;

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

    if(user.passwordChangedAt && UserModel.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt,iat as number)){
            throw new AppError(
              httpStatus.UNAUTHORIZED,
              'You are not authorized',
            );
    }


    if (requiredUserRoles && !requiredUserRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
