import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas (com autenticação)
router.use(authMiddleware);

// Buscar produtos (todos os usuários autenticados)
router.get('/', ProductController.getProducts);
router.get('/popular', ProductController.getPopularProducts);
router.get('/without-category', ProductController.getProductsWithoutCategory);
router.get('/category/:categoryId', ProductController.getProductsByCategory);
router.get('/:id', ProductController.getProductById);

// Rotas administrativas (apenas admin)
router.post('/', adminMiddleware, ProductController.createProduct);
router.put('/:id', adminMiddleware, ProductController.updateProduct);
router.delete('/:id', adminMiddleware, ProductController.deleteProduct);

// Histórico de preços (todos os usuários autenticados)
router.post('/:id/price-history', ProductController.addPriceHistory);

export default router;
