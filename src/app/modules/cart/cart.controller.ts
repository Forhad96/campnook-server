import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { CartServices } from './cart.service';
import catchAsync from '../../utils/cathAsync';

const handleAddToCart = catchAsync(async (req, res) => {
  const { user:email, product, quantity } = req.body;
  const result = await CartServices.addToCart(email, { product, quantity });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart added successfully',
    data: result,
  });
});
const handleUpdateCartItem = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const cartItems = req.body;
  const result = await CartServices.updateCartItem(userId, cartItems);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart item updated successfully',
    data: result,
  });
});
const handleDeleteCartItem = catchAsync(async (req, res) => {
  const { userId, productId } = req.params;

  const result = await CartServices.deleteCartItem(userId, productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart item deleted successfully',
    data: result,
  });
});

const handelGetUserCart = catchAsync(async (req, res) => {
  const result = await CartServices.getUserCart(req.params.email);
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
  handleUpdateCartItem,
  handleDeleteCartItem,
};
