import { model, Schema } from 'mongoose';
import { ICart, ICartItem, IWishlistItem } from './cart.interface';

// Define the user wishlist Item Schema

const wishlistItemSchem = new Schema<IWishlistItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});


// Define the Cart Item Schema
const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

// Define the Cart Schema
const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [cartItemSchema],
    wishlist:[wishlistItemSchem]
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware to update the updatedAt field
cartSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create the Cart model
export const CartModel = model('Cart', cartSchema);
