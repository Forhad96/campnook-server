import { Types } from 'mongoose';
import IProduct from '../product/product.interface';

export interface IWishlistItem {
  product: Types.ObjectId | IProduct;
}
export interface ICartItem {
  product: Types.ObjectId | IProduct;
  quantity: number;
}

export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];
  wishlist: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}
