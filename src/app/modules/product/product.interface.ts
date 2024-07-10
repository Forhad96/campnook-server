export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  ratings?: number;
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default IProduct;
