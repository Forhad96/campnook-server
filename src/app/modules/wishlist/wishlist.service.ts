import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import { WishlistModel } from './wishlist.model';

const addProductToWishlist = async (userId: string, productId: string) => {
  const wishlist = await WishlistModel.findOne({ userId });

  if (wishlist) {
    // const existedWishlist = wishlist.products.find(pId =>pId === productId )
    // if(existedWishlist) {
    //   throw new AppError(httpStatus.CONFLICT,"Already exist in wishlist")
    // }
    wishlist.products.push(productId);
    await wishlist.save();
  } else {
    await WishlistModel.create({ userId, products: [productId] });
  }
  return wishlist
};

const getMyWishlist = async (userId: string) => {

  const wishlist = await WishlistModel.findOne({ userId }).populate('products');
  return wishlist ? wishlist.products : [];
};
const removeProductFromWishlist = async (email: string, productId: string) => {
  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Remove the product from the user's wishlist
    const result = await WishlistModel.updateOne(
      { user: user._id },
      { $pull: { products: { product: productId } } },
    );

    if (result.modifiedCount === 0) {
      throw new Error('Product not found in wishlist or no changes made');
    }

    console.log(
      `Product ${productId} has been removed from the wishlist for user with email ${email}.`,
    );
    return result;
  } catch (error) {
    console.error(
      `Error removing product from wishlist for user with email ${email}:`,
      error,
    );
    throw error;
  }
};

export const wishlistServices = {
  addProductToWishlist,
getMyWishlist,
  removeProductFromWishlist,
};
