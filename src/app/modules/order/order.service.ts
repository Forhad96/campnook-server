import { startSession } from 'mongoose';
import { UserModel } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { CartModel } from '../cart/cart.model';
import { ProductModel } from '../product/product.module';
import { OrderModel } from './order.model';
import { IOrder } from './order.interface';

const checkout = async (userId: string, orderDetails:IOrder) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { name, email, phone, address, paymentMethod } = orderDetails;

    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'User not found. Please register or log in.',
      );
    }

    const cart = await CartModel.findOne({ user: userId }).session(session);
    if (!cart || cart.items.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Cart is empty.');
    }

    for (const item of cart.items) {
      const product = await ProductModel.findById(item.product).session(
        session,
      );
      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found.');
      }
      if (product.stock < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for ${product.name}.`,
        );
      }
      product.stock -= item.quantity;
      await product.save({ session });
    }

    const order = new OrderModel({
      user: userId,
      items: cart.items,
      name,
      email,
      phone,
      address,
      paymentMethod,
      status: 'Pending',
    });

    await order.save({ session });
    await CartModel.findOneAndDelete({ user: userId }).session(session);

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const checkoutServices = {
  checkout,
};
