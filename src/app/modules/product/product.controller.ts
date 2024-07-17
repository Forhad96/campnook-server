import httpStatus from 'http-status';
import catchAsync from '../../utils/cathAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

const handelCreateProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProduct(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const handelGetAllProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProducts(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Retrieves successfully',
    data: result,
  });
});
const handelSingleProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getSingleProduct(req.params.productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Product Retrieves successfully',
    data: result,
  });
});
const handelUpdateProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.updateProduct(
    req.params.productId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update Product successful',
    data: result,
  });
});
const handelDeleteProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.deleteProduct(req.params.productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Product deleted successful',
    data: result,
  });
});

export const ProductControllers = {
  handelCreateProduct,
  handelGetAllProduct,
  handelSingleProduct,
  handelUpdateProduct,
  handelDeleteProduct
};
