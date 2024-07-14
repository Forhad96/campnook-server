import { ICategory } from './category.interface';
import { CategoryModel } from './category.module';

const addCategory = (payload: ICategory) => {
  const result = CategoryModel.create(payload);

  return result;
};

export const CategoryServices = {
  addCategory,
};
