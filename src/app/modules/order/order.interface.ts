import mongoose, { Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: { product: mongoose.Types.ObjectId; quantity: number }[];
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  status: string;
}

