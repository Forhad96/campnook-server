import { Router } from 'express';
import { WishlistController } from './wishlist.controller';

const router = Router();

router.post('/add', WishlistController.handelCreateWishlist);
router.post(
  '/remove',
  WishlistController.handelRemoveProductFromWishlist,
);
router.get('/:userId', WishlistController.handelGetMyWishlist);

export const wishlistRoutes = router;
