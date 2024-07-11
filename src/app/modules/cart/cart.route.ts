import { Router } from 'express';
import { CartControllers } from './cart.controller';

const router = Router();

router.post('/:userId', CartControllers.handleAddToCart);
router.get('/:userId', CartControllers.handelGetUserCart);

export const CartRoutes = router;
