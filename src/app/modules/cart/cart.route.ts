import { Router } from 'express';
import { CartControllers } from './cart.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../user/user.constant';

const router = Router();

router.post('/',auth(USER_ROLES.user), CartControllers.handleAddToCart);
router.patch(
  '/',
  auth(USER_ROLES.user),
  CartControllers.handleUpdateCartItem,
);
router.delete(
  '/:productId',
  auth(USER_ROLES.user),
  CartControllers.handleDeleteCartItem,
);

router.get('/user-cart', auth(USER_ROLES.user), CartControllers.handelGetUserCart);

export const CartRoutes = router;
