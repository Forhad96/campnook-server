import { Router } from 'express';
import { WishlistController } from './wishlist.controller';

const router = Router();

router.post('/add-wishlist', WishlistController.handelCreateWishlist);
router.get('/:userId', WishlistController.handelGetMyWishlist);

export const wishlistRoutes = router;
