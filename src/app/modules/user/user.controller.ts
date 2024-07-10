
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/cathAsync';
import { UserServices } from './user.service';

// 

const handelCreateUser= catchAsync(async (req, res) => {
  
const result = await UserServices.createUser(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user created successfully',
    data: result,
  });
});


export const UserControllers = {
  handelCreateUser,

};
