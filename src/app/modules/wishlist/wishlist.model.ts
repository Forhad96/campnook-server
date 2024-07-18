// Define the user wishlist Item Schema

import { model, Schema } from 'mongoose';
import { IWishlist } from './wishlist.interface';
const wishlistSchema = new Schema<IWishlist>({
  userId: { type: Schema.Types.ObjectId, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

export const WishlistModel = model<IWishlist>('Wishlist', wishlistSchema);
