import httpStatus from 'http-status';
import catchAsync from '../../utils/cathAsync';
import sendResponse from '../../utils/sendResponse';
import { wishlistServices } from './wishlist.service';

const handelCreateWishlist = catchAsync(async (req, res) => {
  const { userId, productId } = req.body;
  const result = await wishlistServices.addProductToWishlist(userId, productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' wishlist added successful',
    data: result,
  });
});
const handelGetMyWishlist = catchAsync(async (req, res) => {
  const { email } = req.user
  const result = await wishlistServices.getMyWishlist(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' wishlist retrieves successful',
    data: result,
  });
});
const handelRemoveProductFromWishlist = catchAsync(async (req, res) => {
  const { userId, productId } = req.body;
  const result = await wishlistServices.removeProductFromWishlist(
    userId,
    productId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Product removed from wishlist successfully',
    data: result,
  });
});

export const WishlistController = {
  handelCreateWishlist,
  handelGetMyWishlist,
  handelRemoveProductFromWishlist,
};
