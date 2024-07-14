import { Router } from 'express';
import { CartControllers } from './cart.controller';

const router = Router();

router.post('/', CartControllers.handleAddToCart);
router.patch('/:email', CartControllers.handleUpdateCartItem);
router.delete('/:email/:productId', CartControllers.handleDeleteCartItem);

router.get('/:email', CartControllers.handelGetUserCart);

export const CartRoutes = router;
