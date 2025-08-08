import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

// Registrar todas as rotas
router.use('/users', userRoutes);

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
      }
    }
  });
});

export default router;
