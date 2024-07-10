import { z } from 'zod';

const zCreateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim(),
    description: z.string().min(1, 'Description is required').trim(),
    price: z.number().min(0, 'Price must be a positive number'),
    category: z.string().min(1, 'Category is required').trim(),
    stock: z.number().min(0, 'Stock must be a positive number'),
    ratings: z.number().min(0).max(5).default(0),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
    createdAt: z.date().default(() => new Date()).optional(),
    updatedAt: z.date().default(() => new Date()).optional(),
  }),
});



export const ProductValidations = {
  zCreateProductSchema,
};
