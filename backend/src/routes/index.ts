import { Router } from 'express';
import userRoutes from './user.routes';
import shoppingListRoutes from './shopping-list.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';

const router = Router();

// Registrar todas as rotas
router.use('/users', userRoutes);
router.use('/shopping-lists', shoppingListRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

// Rota de informações da API
router.get('/', (req, res) => {
  res.json({
    status: 'SUCCESS',
    message: 'API Meu Carrim funcionando!',
    version: '1.0.0',
    endpoints: {
      users: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login',
        profile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile',
        getAllUsers: 'GET /api/users (admin)',
        getUserById: 'GET /api/users/:id',
        updateUser: 'PUT /api/users/:id (admin)',
        deleteUser: 'DELETE /api/users/:id (admin)',
        promoteToAdmin: 'POST /api/users/:id/promote'
      },
      shoppingLists: {
        create: 'POST /api/shopping-lists',
        getUserLists: 'GET /api/shopping-lists',
        getById: 'GET /api/shopping-lists/:id',
        update: 'PUT /api/shopping-lists/:id',
        delete: 'DELETE /api/shopping-lists/:id',
        addItem: 'POST /api/shopping-lists/:id/items',
        updateItem: 'PUT /api/shopping-lists/items/:itemId',
        removeItem: 'DELETE /api/shopping-lists/items/:itemId',
        toggleItem: 'PATCH /api/shopping-lists/items/:itemId/toggle',
        duplicate: 'POST /api/shopping-lists/:id/duplicate',
        getAllLists: 'GET /api/shopping-lists/admin/all (admin)'
      },
      products: {
        getAll: 'GET /api/products',
        getById: 'GET /api/products/:id',
        getPopular: 'GET /api/products/popular',
        getByCategory: 'GET /api/products/category/:categoryId',
        getWithoutCategory: 'GET /api/products/without-category',
        create: 'POST /api/products (admin)',
        update: 'PUT /api/products/:id (admin)',
        delete: 'DELETE /api/products/:id (admin)',
        addPriceHistory: 'POST /api/products/:id/price-history'
      },
      categories: {
        getAll: 'GET /api/categories',
        getById: 'GET /api/categories/:id',
        getPopular: 'GET /api/categories/popular',
        create: 'POST /api/categories (admin)',
        update: 'PUT /api/categories/:id (admin)',
        delete: 'DELETE /api/categories/:id (admin)',
        forceDelete: 'DELETE /api/categories/:id/force (admin)'
      }
    }
  });
});

export default router;
