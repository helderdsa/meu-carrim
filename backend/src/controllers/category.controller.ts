import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { AuthRequest } from '../types/user.types';
import { validateId } from '../utils/validation.utils';

export class CategoryController {
  // Criar categoria (apenas admin)
  static async createCategory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, description, color, icon } = req.body;

      if (!name?.trim()) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Nome da categoria é obrigatório'
        });
        return;
      }

      const category = await CategoryService.createCategory({
        name: name.trim(),
        description: description?.trim(),
        color: color?.trim(),
        icon: icon?.trim()
      });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Categoria criada com sucesso',
        data: category
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Buscar todas as categorias
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryService.getCategories();

      res.json({
        status: 'SUCCESS',
        data: categories
      });
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar categoria por ID
  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const category = await CategoryService.getCategoryById(id);

      if (!category) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Categoria não encontrada'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        data: category
      });
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar categoria (apenas admin)
  static async updateCategory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const { name, description, color, icon } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description?.trim();
      if (color !== undefined) updateData.color = color?.trim();
      if (icon !== undefined) updateData.icon = icon?.trim();

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Nenhum dado para atualizar foi fornecido'
        });
        return;
      }

      const category = await CategoryService.updateCategory(id, updateData);

      if (!category) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Categoria não encontrada'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        message: 'Categoria atualizada com sucesso',
        data: category
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Deletar categoria (apenas admin)
  static async deleteCategory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      
      await CategoryService.deleteCategory(id);

      res.json({
        status: 'SUCCESS',
        message: 'Categoria deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Deletar categoria e remover de produtos (apenas admin)
  static async forceDeleteCategory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      
      const success = await CategoryService.removeCategoryFromProducts(id);

      if (!success) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Não foi possível deletar a categoria'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        message: 'Categoria deletada com sucesso e removida de todos os produtos'
      });
    } catch (error) {
      console.error('Erro ao forçar deleção da categoria:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar categorias populares
  static async getPopularCategories(req: Request, res: Response): Promise<void> {
    try {
      const { limit = '10' } = req.query;
      const limitNum = Math.min(parseInt(limit as string) || 10, 50);

      const categories = await CategoryService.getPopularCategories(limitNum);

      res.json({
        status: 'SUCCESS',
        data: categories
      });
    } catch (error) {
      console.error('Erro ao buscar categorias populares:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }
}
