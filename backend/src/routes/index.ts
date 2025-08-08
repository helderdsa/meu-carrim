import { Router } from 'express';
import userRoutes from './user.routes';
import shoppingListRoutes from './shopping-list.routes';

const router = Router();

// Registrar todas as rotas
router.use('/users', userRoutes);
router.use('/shopping-lists', shoppingListRoutes);

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
      }
    }
  });
});

export default router;
