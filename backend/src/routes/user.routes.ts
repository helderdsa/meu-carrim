import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Rotas protegidas (requer autenticação)
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, UserController.updateProfile);

// Rotas de administrador
router.get('/', authMiddleware, adminMiddleware, UserController.getAllUsers);
router.get('/:id', authMiddleware, UserController.getUserById);
router.put('/:id', authMiddleware, adminMiddleware, UserController.updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, UserController.deleteUser);

// Rota especial para desenvolvimento (promover a admin)
router.post('/:id/promote', UserController.promoteToAdmin);

export default router;
