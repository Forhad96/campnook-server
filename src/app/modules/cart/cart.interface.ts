import { Types } from 'mongoose';

export interface IWishlistItem {
  product: Types.ObjectId;
}
export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];
  wishlist: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}
