import QueryBuilder from '../../builder/QueryBuilder';
import { productSearchableFields } from './product.constant';
import IProduct from './product.interface';
import { ProductModel } from './product.module';

const createProduct = (payload: IProduct) => {
  const result = ProductModel.create(payload);
  return result;
};
const getAllProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(ProductModel.find(), query)
    .search(productSearchableFields)
    .filter()
    .sort()
    .pagination()
    .fields()

  const result = await productQuery.modelQuery;
  return result;
};
const getSingleProduct = (id: string) => {
  const result = ProductModel.findById(id);
  return result;
};
const updateProduct = async (id: string, payload: Partial<IProduct>) => {
  const result = await ProductModel.findByIdAndUpdate(
    id,
    { ...payload },
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure the update adheres to the schema
    },
  );
  return result;
};

export const ProductServices = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
};
