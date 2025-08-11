import { Request, Response } from 'express';
import { PriceHistoryService } from '../services/price-history.service';
import { CreatePriceHistoryRequest, UpdatePriceHistoryRequest } from '../types/price-history.types';

export class PriceHistoryController {
  // Criar registro de preço
  static async createPriceHistory(req: Request, res: Response): Promise<void> {
    try {
      const data: CreatePriceHistoryRequest = req.body;
      
      const priceHistory = await PriceHistoryService.createPriceHistory(data);
      
      res.status(201).json({
        success: true,
        data: priceHistory
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Listar histórico de preços
  static async getPriceHistory(req: Request, res: Response): Promise<void> {
    try {
      const { productId, marketId, startDate, endDate } = req.query;
      
      const queryParams: any = {};
      
      if (productId) queryParams.productId = productId as string;
      if (marketId) queryParams.marketId = marketId as string;
      if (startDate) queryParams.startDate = new Date(startDate as string);
      if (endDate) queryParams.endDate = new Date(endDate as string);
      
      const priceHistory = await PriceHistoryService.getPriceHistory(queryParams);
      
      res.json({
        success: true,
        data: priceHistory
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Buscar registro específico
  static async getPriceHistoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID é obrigatório'
        });
        return;
      }
      
      const priceHistory = await PriceHistoryService.getPriceHistoryById(id);
      
      if (!priceHistory) {
        res.status(404).json({
          success: false,
          message: 'Registro de preço não encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        data: priceHistory
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Atualizar registro de preço
  static async updatePriceHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdatePriceHistoryRequest = req.body;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID é obrigatório'
        });
        return;
      }
      
      const priceHistory = await PriceHistoryService.updatePriceHistory(id, data);
      
      if (!priceHistory) {
        res.status(404).json({
          success: false,
          message: 'Registro de preço não encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        data: priceHistory
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Deletar registro de preço
  static async deletePriceHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID é obrigatório'
        });
        return;
      }
      
      const success = await PriceHistoryService.deletePriceHistory(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Registro de preço não encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Registro de preço deletado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Buscar preço médio de um produto por mercado
  static async getAverageByMarket(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const { days = 30 } = req.query;
      
      if (!productId) {
        res.status(400).json({
          success: false,
          message: 'Product ID é obrigatório'
        });
        return;
      }
      
      const comparison = await PriceHistoryService.compareProductPricesAcrossMarkets(
        productId,
        parseInt(days as string)
      );
      
      res.json({
        success: true,
        data: {
          productId,
          period: `${days} dias`,
          marketComparison: comparison
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Buscar menor preço de um produto  
  static async getLowestPrice(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const { days = 30 } = req.query;
      
      if (!productId) {
        res.status(400).json({
          success: false,
          message: 'Product ID é obrigatório'
        });
        return;
      }
      
      const lowestPrice = await PriceHistoryService.getProductLowestPrice(
        productId,
        parseInt(days as string)
      );
      
      if (!lowestPrice) {
        res.status(404).json({
          success: false,
          message: 'Nenhum registro de preço encontrado para este produto'
        });
        return;
      }
      
      res.json({
        success: true,
        data: {
          productId,
          ...lowestPrice,
          period: `${days} dias`
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Buscar preço médio de um produto
  static async getAveragePrice(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const { days = 30 } = req.query;
      
      if (!productId) {
        res.status(400).json({
          success: false,
          message: 'Product ID é obrigatório'
        });
        return;
      }
      
      const averagePrice = await PriceHistoryService.getProductAveragePrice(
        productId,
        parseInt(days as string)
      );
      
      if (averagePrice === null) {
        res.status(404).json({
          success: false,
          message: 'Nenhum registro de preço encontrado para este produto'
        });
        return;
      }
      
      res.json({
        success: true,
        data: {
          productId,
          averagePrice,
          period: `${days} dias`
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}
