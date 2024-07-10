import httpStatus from 'http-status';
import catchAsync from '../../utils/cathAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';

const handleLoginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { accessToken, refreshToken, needsPasswordChange } = result;
  // set refresh token on cookie

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully ',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});
const handleChangePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePassword(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'password changed successfully ',
    data: result,
  });
});
const handleRefreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});
const handleForgotPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgotPassword(req.body.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});
const handleResetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const result = await AuthServices.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successful!',
    data: result,
  });
});

export const AuthControllers = {
  handleLoginUser,
  handleChangePassword,
  handleRefreshToken,
  handleForgotPassword,
  handleResetPassword,
};
