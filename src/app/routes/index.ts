import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.routes';

import { AuthRoutes } from '../modules/auth/auth.routes';
import { ProductRoutes } from '../modules/product/product.route';
import { CartRoutes } from '../modules/cart/cart.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { wishlistRoutes } from '../modules/wishlist/wishlist.route';


const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/carts',
    route: CartRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/wishlist',
    route: wishlistRoutes,
  },
  

];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
