import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { WishlistModel } from './wishlist.model';
import { ProductModel } from '../product/product.module';
import { UserModel } from '../user/user.model';

const addProductToWishlist = async (userId: string, productId: string) => {
  const isExistProduct = await ProductModel.findById(productId);
  if (!isExistProduct) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Product is not exist on the database',
    );
  }
  let wishlist = await WishlistModel.findOne({ userId });

  if (wishlist && wishlist.products.includes(productId)) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Product already exists in the wishlist',
    );
  }

  if (wishlist) {
    wishlist.products.push(productId);
  } else {
    wishlist = new WishlistModel({ userId, products: [productId] });
  }
  await wishlist.save();
  return wishlist;
};

const getMyWishlist = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User is not exist on the database',
    );
  }
  const userId = user?._id;
  const wishlist = await WishlistModel.findOne({ userId }).populate('products');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Wishlist not found for the user');
  }
  return wishlist;
};
const removeProductFromWishlist = async (userId: string, productId: string) => {
  const wishlist = await WishlistModel.findOne({ userId });

  if (!wishlist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Wishlist not found for the user');
  }
  // console.log(object);
  wishlist.products = wishlist.products.filter(
    id => id.toString() !== productId,
  );
  await wishlist.save();
  // return { message: 'Product removed from wishlist successfully' };
  return wishlist;
};
export const wishlistServices = {
  addProductToWishlist,
  getMyWishlist,
  removeProductFromWishlist,
};
