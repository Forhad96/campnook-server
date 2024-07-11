import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { CartServices } from './cart.service';
import catchAsync from '../../utils/cathAsync';

const handleAddToCart = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const cartItems = req.body;
  const result = await CartServices.addToCart(userId, cartItems);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart added successfully',
    data: result,
  });
});

const handelGetUserCart = catchAsync(async (req, res) => {
  const result = await CartServices.getUserCart(req.params.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User cart retrieves successful',
    data: result,
  });
});

export const CartControllers = {
  handleAddToCart,
  handelGetUserCart,
};
