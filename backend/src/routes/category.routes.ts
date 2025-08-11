import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas (com autenticação)
router.use(authMiddleware);

// Buscar categorias (todos os usuários autenticados)
router.get('/', CategoryController.getCategories);
router.get('/popular', CategoryController.getPopularCategories);
router.get('/:id', CategoryController.getCategoryById);

// Rotas administrativas (apenas admin)
router.post('/', adminMiddleware, CategoryController.createCategory);
router.put('/:id', adminMiddleware, CategoryController.updateCategory);
router.delete('/:id', adminMiddleware, CategoryController.deleteCategory);
router.delete('/:id/force', adminMiddleware, CategoryController.forceDeleteCategory);

export default router;
