import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ICartItem } from './cart.interface';
import { CartModel } from './cart.model';
import { UserModel } from '../user/user.model';
import { ProductModel } from '../product/product.module';
import { startSession } from 'mongoose';

const addToCart = async (userId: string, item: ICartItem) => {
  const { product: productId, quantity } = item;

  // Validate positive quantity
  if (quantity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Quantity must be greater than zero.',
    );
  }

  // Start a session for transaction
  const session = await startSession();
  session.startTransaction();

  try {
    // Validate user existence
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'User not found. Please register or log in.',
      );
    }

    // Validate product existence
    const product = await ProductModel.findById(productId).session(session);
    if (!product) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Product not found. Please check the product ID.',
      );
    }

    // Validate product stock availability
    if (product.stock < quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Product stock is not sufficient for the requested quantity.',
      );
    }

    // Retrieve or create cart for user
    let cart = await CartModel.findOne({ user: userId }).session(session);
    if (!cart) {
      cart = new CartModel({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already exists in cart
      const existingCartItem = cart.items.find(
        item => item.product.toString() === productId.toString(),
      );

      if (existingCartItem) {
        // Validate stock for additional quantity
        if (existingCartItem.quantity + quantity > product.stock) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Cannot add more items. Stock limit reached.',
          );
        }
        // Update existing item quantity
        existingCartItem.quantity += quantity;
      } else {
        // Add new item to cart
        cart.items.push({ product: productId, quantity });
      }
    }

    // Save updated cart
    await cart.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return cart;
  } catch (error) {
    // Rollback transaction in case of error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


const getUserCart = async (userId: string) => {
  const cart = await CartModel.findOne({ user: userId }).populate(
    'items.product',
  );

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  return cart;
};

export const CartServices = {
  addToCart,
  getUserCart,
};
