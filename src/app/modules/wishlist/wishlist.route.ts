import { Router } from 'express';
import { WishlistController } from './wishlist.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../user/user.constant';

const router = Router();

router.post('/add', WishlistController.handelCreateWishlist);
router.post(
  '/remove',
  WishlistController.handelRemoveProductFromWishlist,
);
router.get('/my-wishlist',auth(USER_ROLES.user), WishlistController.handelGetMyWishlist);

export const wishlistRoutes = router;
