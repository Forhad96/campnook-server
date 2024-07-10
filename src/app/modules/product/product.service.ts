import IProduct from './product.interface';
import { ProductModel } from './product.module';

const createProduct = (payload: IProduct) => {
  const result = ProductModel.create(payload);
  return result;
};

export const ProductServices = {
  createProduct,
};
