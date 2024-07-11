import { Router } from 'express';
import { CartControllers } from './cart.controller';

const router = Router();

router.post('/', CartControllers.handleAddToCart);
router.patch('/:userId', CartControllers.handleUpdateCartItem);
router.delete('/:userId/:productId', CartControllers.handleDeleteCartItem);

router.get('/:userId', CartControllers.handelGetUserCart);

export const CartRoutes = router;
