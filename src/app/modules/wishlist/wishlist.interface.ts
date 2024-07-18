// src/interfaces/wishlist.interface.ts

import { Document, Types } from 'mongoose';

export interface IWishlist extends Document {
  userId: Types.ObjectId;
  products: string[]; // Array of product IDs
}
