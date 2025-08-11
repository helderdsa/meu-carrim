import { Router } from 'express';
import { MarketController } from '../controllers/market.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Aplicar autenticação a todas as rotas
router.use(authMiddleware);

// Rotas públicas (todos os usuários autenticados)
router.get('/', MarketController.getMarkets);
router.get('/popular', MarketController.getPopularMarkets);
router.get('/cities', MarketController.getCities);
router.get('/states', MarketController.getStates);
router.get('/nearby', MarketController.getNearbyMarkets);
router.get('/city/:city', MarketController.getMarketsByCity);
router.get('/:id', MarketController.getMarketById);

// Rotas para usuários autenticados
router.post('/', MarketController.createMarket);
router.put('/:id', MarketController.updateMarket);

// Rotas administrativas (apenas admin)
router.delete('/:id', adminMiddleware, MarketController.deleteMarket);
router.delete('/:id/force', adminMiddleware, MarketController.forceDeleteMarket);

export default router;
