import { Router } from 'express';
import { PriceHistoryController } from '../controllers/price-history.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware);

// Rotas CRUD básicas
router.post('/', PriceHistoryController.createPriceHistory);
router.get('/', PriceHistoryController.getPriceHistory);
router.get('/:id', PriceHistoryController.getPriceHistoryById);
router.put('/:id', PriceHistoryController.updatePriceHistory);
router.delete('/:id', PriceHistoryController.deletePriceHistory);

// Rotas de análise
router.get('/product/:productId/average', PriceHistoryController.getAveragePrice);
router.get('/product/:productId/lowest', PriceHistoryController.getLowestPrice);
router.get('/product/:productId/markets', PriceHistoryController.getAverageByMarket);

export default router;
