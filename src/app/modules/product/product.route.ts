import { Router } from 'express';
import { ProductControllers } from './product.controller';
import validateRequest from '../../middleware/validateRequest';
import { ProductValidations } from './product.validator';

const router = Router();

router.post('/', validateRequest(ProductValidations.zCreateProductSchema), ProductControllers.handelCreateProduct);
router.get('/',ProductControllers.handelGetAllProduct);
router.get('/:productId',ProductControllers.handelSingleProduct);
router.put('/:productId',ProductControllers.handelUpdateProduct);

export const ProductRoutes = router;
