import httpStatus from "http-status";
import catchAsync from "../../utils/cathAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoryServices } from "./category.service";


const handleAddCategory = catchAsync(async (req, res) => {
//   const email = req.user.email;
  const result = await CategoryServices.addCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category added successfully',
    data: result,
  });
});
const handleGetAllCategory = catchAsync(async (req, res) => {

  const result = await CategoryServices.getAllCategory();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All category retrieves successfully',
    data: result,
  });
});



export const CategoryController ={
handleAddCategory,
handleGetAllCategory

}