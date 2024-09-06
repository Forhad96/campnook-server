import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ICartItem } from './cart.interface';
import { CartModel } from './cart.model';
import { UserModel } from '../user/user.model';
import { ProductModel } from '../product/product.module';
import { startSession } from 'mongoose';
import IProduct from '../product/product.interface';

const addToCart = async (email: string, item: ICartItem) => {
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
    const user = await UserModel.findOne({ email }).session(session);
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
    const userId = user?._id;
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

const updateCartItem = async (email: string, item: ICartItem) => {
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
    const user = await UserModel.findOne({ email }).session(session);
    if (!user) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'User not found. Please register or log in.',
      );
    }
    const userId = user?._id;

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

    // Retrieve user's cart
    const cart = await CartModel.findOne({ user: userId }).session(session);
    if (!cart) {
      throw new AppError(httpStatus.NOT_FOUND, 'Cart not found for the user.');
    }

    // Find existing cart item
    const existingCartItem = cart.items.find(
      item => item.product.toString() === productId.toString(),
    );

    if (!existingCartItem) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Product not found in the cart.',
      );
    }

    // Validate stock for updated quantity
    const stockDifference = quantity - existingCartItem.quantity;
    if (stockDifference > 0 && stockDifference > product.stock) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Cannot update quantity. Stock limit reached.',
      );
    }

    // Update existing item quantity
    existingCartItem.quantity = quantity;

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
const getUserCart = async (email: string) => {
  // Validate user existence
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found. Please register or log in.',
    );
  }
  const userId = user._id;
  const cart = await CartModel.findOne({ user: userId }).populate({
    path: 'items.product',
    model: 'Product',
  });
console.log(userId);
  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  // Calculate total price
  const totalPrice = cart.items.reduce((total, item) => {
    const product = item.product as IProduct; // Type assertion to handle populated product
    return total + product.price * item.quantity;
  }, 0);

  // Add total price to the cart object
  const cartWithTotal = { ...cart.toObject(), totalPrice };

  return cartWithTotal;
};

const getUserWishlist = async (email: string) => {
  // Validate user existence
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found. Please register or log in.',
    );
  }
  const userId = user._id;
  const cart = await CartModel.findOne({ user: userId }).populate(
    'items.product',
  );

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  return cart;
};
const deleteCartItem = async (email: string, productId: string) => {
  // Start a session for transaction
  const session = await startSession();
  session.startTransaction();
  try {
    // Validate user existence
    const user = await UserModel.findOne({ email }).session(session);
    if (!user) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'User not found. Please register or log in.',
      );
    }
    const userId = user?._id;

    // Validate product existence
    const product = await ProductModel.findById(productId).session(session);
    if (!product) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Product not found. Please check the product ID.',
      );
    }

    // Retrieve user's cart
    const cart = await CartModel.findOne({ user: userId }).session(session);
    if (!cart) {
      throw new AppError(httpStatus.NOT_FOUND, 'Cart not found for the user.');
    }

    // Find existing cart item
    const existingCartItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId.toString(),
    );

    if (existingCartItemIndex === -1) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Product not found in the cart.',
      );
    }

    // Remove item from cart
    cart.items.splice(existingCartItemIndex, 1);

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
export const CartServices = {
  addToCart,
  getUserCart,
  updateCartItem,
  deleteCartItem,
  getUserWishlist,
};
