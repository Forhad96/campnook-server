import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.routes';

import { AuthRoutes } from '../modules/auth/auth.routes';
import { ProductRoutes } from '../modules/product/product.route';
import { CartRoutes } from '../modules/cart/cart.route';


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
  

];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
