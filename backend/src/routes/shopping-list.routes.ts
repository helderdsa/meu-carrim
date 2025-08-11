import { Router } from 'express';
import { ShoppingListController } from '../controllers/shopping-list.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Aplicar autenticação a todas as rotas
router.use(authMiddleware);

// Rotas para listas de compras
router.post('/', ShoppingListController.createShoppingList);
router.get('/', ShoppingListController.getUserShoppingLists);
router.get('/:id', ShoppingListController.getShoppingListById);
router.put('/:id', ShoppingListController.updateShoppingList);
router.delete('/:id', ShoppingListController.deleteShoppingList);

// Rotas para itens da lista
router.post('/:id/items', ShoppingListController.addItemToList);
router.put('/items/:itemId', ShoppingListController.updateListItem);
router.delete('/items/:itemId', ShoppingListController.removeItemFromList);
router.patch('/items/:itemId/toggle', ShoppingListController.toggleItemPurchased);

// Rotas especiais
router.post('/:id/duplicate', ShoppingListController.duplicateShoppingList);

// Rotas administrativas
router.get('/admin/all', adminMiddleware, ShoppingListController.getAllShoppingLists);

export default router;
