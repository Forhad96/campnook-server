import httpStatus from 'http-status';
import catchAsync from '../../utils/cathAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

const handelCreateProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProduct(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user created successfully',
    data: result,
  });
});

export const ProductControllers = {
  handelCreateProduct,
};
