import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { AuthRequest } from '../types/user.types';
import { validateId } from '../utils/validation.utils';

export class ProductController {
  // Criar produto (apenas admin)
  static async createProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, description, image, categoryId } = req.body;

      if (!name?.trim()) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Nome do produto é obrigatório'
        });
        return;
      }

      const product = await ProductService.createProduct({
        name: name.trim(),
        description: description?.trim(),
        image: image?.trim(),
        categoryId: categoryId || undefined
      });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Produto criado com sucesso',
        data: product
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Buscar produtos com filtros
  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { search, categoryId, page = '1', limit = '20' } = req.query;

      const query = {
        search: search as string,
        categoryId: categoryId as string,
        page: parseInt(page as string) || 1,
        limit: Math.min(parseInt(limit as string) || 20, 100) // máximo 100
      };

      const result = await ProductService.getProducts(query);

      res.json({
        status: 'SUCCESS',
        data: result.products,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar produto por ID
  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const product = await ProductService.getProductById(id);

      if (!product) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Produto não encontrado'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        data: product
      });
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar produto (apenas admin)
  static async updateProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const { name, description, image, categoryId } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description?.trim();
      if (image !== undefined) updateData.image = image?.trim();
      if (categoryId !== undefined) updateData.categoryId = categoryId || null;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Nenhum dado para atualizar foi fornecido'
        });
        return;
      }

      const product = await ProductService.updateProduct(id, updateData);

      if (!product) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Produto não encontrado'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        message: 'Produto atualizado com sucesso',
        data: product
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Deletar produto (apenas admin)
  static async deleteProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      
      await ProductService.deleteProduct(id);

      res.json({
        status: 'SUCCESS',
        message: 'Produto deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Buscar produtos populares
  static async getPopularProducts(req: Request, res: Response): Promise<void> {
    try {
      const { limit = '10' } = req.query;
      const limitNum = Math.min(parseInt(limit as string) || 10, 50);

      const products = await ProductService.getPopularProducts(limitNum);

      res.json({
        status: 'SUCCESS',
        data: products
      });
    } catch (error) {
      console.error('Erro ao buscar produtos populares:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar produtos por categoria
  static async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = validateId(req.params.categoryId);
      const products = await ProductService.getProductsByCategory(categoryId);

      res.json({
        status: 'SUCCESS',
        data: products
      });
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar produtos sem categoria
  static async getProductsWithoutCategory(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.getProductsWithoutCategory();

      res.json({
        status: 'SUCCESS',
        data: products
      });
    } catch (error) {
      console.error('Erro ao buscar produtos sem categoria:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Adicionar histórico de preço
  static async addPriceHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const productId = validateId(req.params.id);
      const { marketId, price, purchaseDate } = req.body;

      if (!marketId || !price) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Market ID e preço são obrigatórios'
        });
        return;
      }

      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Preço deve ser um número positivo'
        });
        return;
      }

      const success = await ProductService.addPriceHistory(
        productId,
        marketId,
        priceNum,
        purchaseDate ? new Date(purchaseDate) : undefined
      );

      if (!success) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Não foi possível adicionar o histórico de preço'
        });
        return;
      }

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Histórico de preço adicionado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao adicionar histórico de preço:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }
}
