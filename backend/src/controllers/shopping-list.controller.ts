import { Request, Response } from 'express';
import { ShoppingListService } from '../services/shopping-list.service';
import { AuthRequest } from '../types/user.types';
import { validateId } from '../utils/validation.utils';

export class ShoppingListController {
  // Criar nova lista de compras
  static async createShoppingList(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;
      const userId = req.user!.id;

      if (!name?.trim()) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Nome da lista é obrigatório'
        });
        return;
      }

      const shoppingList = await ShoppingListService.createShoppingList(userId, {
        name: name.trim(),
        description: description?.trim()
      });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Lista de compras criada com sucesso',
        data: shoppingList
      });
    } catch (error) {
      console.error('Erro ao criar lista de compras:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar todas as listas do usuário
  static async getUserShoppingLists(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const shoppingLists = await ShoppingListService.getUserShoppingLists(userId);

      res.json({
        status: 'SUCCESS',
        data: shoppingLists
      });
    } catch (error) {
      console.error('Erro ao buscar listas de compras:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar lista por ID
  static async getShoppingListById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Admin pode ver qualquer lista, usuário comum só suas próprias
      const shoppingList = await ShoppingListService.getShoppingListById(
        id, 
        userRole === 'ADMIN' ? undefined : userId
      );

      if (!shoppingList) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Lista de compras não encontrada'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        data: shoppingList
      });
    } catch (error) {
      console.error('Erro ao buscar lista de compras:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar lista de compras
  static async updateShoppingList(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const { name, description, isCompleted } = req.body;
      const userId = req.user!.id;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description?.trim();
      if (isCompleted !== undefined) updateData.isCompleted = Boolean(isCompleted);

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Nenhum dado para atualizar foi fornecido'
        });
        return;
      }

      const shoppingList = await ShoppingListService.updateShoppingList(id, userId, updateData);

      if (!shoppingList) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Lista de compras não encontrada'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        message: 'Lista de compras atualizada com sucesso',
        data: shoppingList
      });
    } catch (error) {
      console.error('Erro ao atualizar lista de compras:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Deletar lista de compras
  static async deleteShoppingList(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const userId = req.user!.id;

      const deleted = await ShoppingListService.deleteShoppingList(id, userId);

      if (!deleted) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Lista de compras não encontrada'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        message: 'Lista de compras deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar lista de compras:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Adicionar item à lista
  static async addItemToList(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const { productId, quantity, notes, estimatedPrice } = req.body;
      const userId = req.user!.id;

      if (!productId) {
        res.status(400).json({
          status: 'ERROR',
          message: 'ID do produto é obrigatório'
        });
        return;
      }

      const item = await ShoppingListService.addItemToList(id, userId, {
        productId,
        quantity: quantity ? parseInt(quantity) : undefined,
        notes: notes?.trim(),
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : undefined
      });

      if (!item) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Não foi possível adicionar o item à lista. Verifique se a lista e o produto existem, e se o item já não está na lista.'
        });
        return;
      }

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Item adicionado à lista com sucesso',
        data: item
      });
    } catch (error) {
      console.error('Erro ao adicionar item à lista:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar item da lista
  static async updateListItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      const itemId = validateId(req.params.itemId);
      const { quantity, isPurchased, notes, estimatedPrice } = req.body;
      const userId = req.user!.id;

      const updateData: any = {};
      if (quantity !== undefined) updateData.quantity = parseInt(quantity);
      if (isPurchased !== undefined) updateData.isPurchased = Boolean(isPurchased);
      if (notes !== undefined) updateData.notes = notes?.trim();
      if (estimatedPrice !== undefined) updateData.estimatedPrice = parseFloat(estimatedPrice);

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Nenhum dado para atualizar foi fornecido'
        });
        return;
      }

      const item = await ShoppingListService.updateListItem(itemId, userId, updateData);

      if (!item) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Item não encontrado'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        message: 'Item atualizado com sucesso',
        data: item
      });
    } catch (error) {
      console.error('Erro ao atualizar item da lista:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Remover item da lista
  static async removeItemFromList(req: AuthRequest, res: Response): Promise<void> {
    try {
      const itemId = validateId(req.params.itemId);
      const userId = req.user!.id;

      const removed = await ShoppingListService.removeItemFromList(itemId, userId);

      if (!removed) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Item não encontrado'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        message: 'Item removido da lista com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover item da lista:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Marcar/desmarcar item como comprado
  static async toggleItemPurchased(req: AuthRequest, res: Response): Promise<void> {
    try {
      const itemId = validateId(req.params.itemId);
      const userId = req.user!.id;

      const item = await ShoppingListService.toggleItemPurchased(itemId, userId);

      if (!item) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Item não encontrado'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        message: `Item ${item.isPurchased ? 'marcado como comprado' : 'desmarcado'} com sucesso`,
        data: item
      });
    } catch (error) {
      console.error('Erro ao alterar status do item:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Duplicar lista de compras
  static async duplicateShoppingList(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const userId = req.user!.id;

      const newList = await ShoppingListService.duplicateShoppingList(id, userId);

      if (!newList) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Lista de compras não encontrada'
        });
        return;
      }

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Lista duplicada com sucesso',
        data: newList
      });
    } catch (error) {
      console.error('Erro ao duplicar lista de compras:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar todas as listas (apenas admin)
  static async getAllShoppingLists(req: AuthRequest, res: Response): Promise<void> {
    try {
      const shoppingLists = await ShoppingListService.getAllShoppingLists();

      res.json({
        status: 'SUCCESS',
        data: shoppingLists
      });
    } catch (error) {
      console.error('Erro ao buscar todas as listas:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }
}
