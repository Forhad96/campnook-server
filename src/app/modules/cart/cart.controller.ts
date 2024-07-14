import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { CartServices } from './cart.service';
import catchAsync from '../../utils/cathAsync';

const handleAddToCart = catchAsync(async (req, res) => {
  const email = req.user.email;
  const { product, quantity } = req.body;
  const result = await CartServices.addToCart(email, { product, quantity });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart added successfully',
    data: result,
  });
});
const handleUpdateCartItem = catchAsync(async (req, res) => {
  const email = req.user.email;
  const cartItems = req.body;
  const result = await CartServices.updateCartItem(email, cartItems);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart item updated successfully',
    data: result,
  });
});
const handleDeleteCartItem = catchAsync(async (req, res) => {
  const { email, productId } = req.params;

  const result = await CartServices.deleteCartItem(email, productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart item deleted successfully',
    data: result,
  });
});

const handelGetUserCart = catchAsync(async (req, res) => {
  const email = req.user.email;
  const result = await CartServices.getUserCart(email);
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
