import { Request, Response } from 'express';
import { MarketService } from '../services/market.service';
import { AuthRequest } from '../types/user.types';
import { validateId } from '../utils/validation.utils';

export class MarketController {
  // Criar mercado (usuários autenticados)
  static async createMarket(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, address, city, state, zipCode, latitude, longitude } = req.body;

      if (!name?.trim()) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Nome do mercado é obrigatório'
        });
        return;
      }

      // Validar coordenadas se fornecidas
      if ((latitude !== undefined && longitude === undefined) || 
          (longitude !== undefined && latitude === undefined)) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Latitude e longitude devem ser fornecidas juntas'
        });
        return;
      }

      const market = await MarketService.createMarket({
        name: name.trim(),
        address: address?.trim(),
        city: city?.trim(),
        state: state?.trim(),
        zipCode: zipCode?.trim(),
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined
      });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Mercado criado com sucesso',
        data: market
      });
    } catch (error) {
      console.error('Erro ao criar mercado:', error);
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Buscar mercados com filtros
  static async getMarkets(req: Request, res: Response): Promise<void> {
    try {
      const { 
        search, 
        city, 
        state, 
        latitude, 
        longitude, 
        radius, 
        page = '1', 
        limit = '20' 
      } = req.query;

      const query: any = {
        search: search as string,
        city: city as string,
        state: state as string,
        page: parseInt(page as string) || 1,
        limit: Math.min(parseInt(limit as string) || 20, 100)
      };

      // Adicionar filtros de localização se fornecidos
      if (latitude && longitude) {
        query.latitude = parseFloat(latitude as string);
        query.longitude = parseFloat(longitude as string);
        query.radius = radius ? parseFloat(radius as string) : 10; // padrão 10km
      }

      const result = await MarketService.getMarkets(query);

      res.json({
        status: 'SUCCESS',
        data: result.markets,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar mercados:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar mercado por ID
  static async getMarketById(req: Request, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const market = await MarketService.getMarketById(id);

      if (!market) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Mercado não encontrado'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        data: market
      });
    } catch (error) {
      console.error('Erro ao buscar mercado:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar mercado (usuários autenticados)
  static async updateMarket(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const { name, address, city, state, zipCode, latitude, longitude } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (address !== undefined) updateData.address = address?.trim();
      if (city !== undefined) updateData.city = city?.trim();
      if (state !== undefined) updateData.state = state?.trim();
      if (zipCode !== undefined) updateData.zipCode = zipCode?.trim();
      if (latitude !== undefined) updateData.latitude = parseFloat(latitude);
      if (longitude !== undefined) updateData.longitude = parseFloat(longitude);

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Nenhum dado para atualizar foi fornecido'
        });
        return;
      }

      // Validar coordenadas se fornecidas
      if ((updateData.latitude !== undefined && updateData.longitude === undefined) || 
          (updateData.longitude !== undefined && updateData.latitude === undefined)) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Latitude e longitude devem ser fornecidas juntas'
        });
        return;
      }

      const market = await MarketService.updateMarket(id, updateData);

      if (!market) {
        res.status(404).json({
          status: 'ERROR',
          message: 'Mercado não encontrado'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        message: 'Mercado atualizado com sucesso',
        data: market
      });
    } catch (error) {
      console.error('Erro ao atualizar mercado:', error);
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Deletar mercado (apenas admin)
  static async deleteMarket(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      
      await MarketService.deleteMarket(id);

      res.json({
        status: 'SUCCESS',
        message: 'Mercado deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar mercado:', error);
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Deletar mercado forçado (apenas admin)
  static async forceDeleteMarket(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      
      const success = await MarketService.forceDeleteMarket(id);

      if (!success) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Não foi possível deletar o mercado'
        });
        return;
      }

      res.json({
        status: 'SUCCESS',
        message: 'Mercado deletado com sucesso junto com todo seu histórico'
      });
    } catch (error) {
      console.error('Erro ao forçar deleção do mercado:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar mercados por cidade
  static async getMarketsByCity(req: Request, res: Response): Promise<void> {
    try {
      const { city } = req.params;

      if (!city?.trim()) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Nome da cidade é obrigatório'
        });
        return;
      }

      const markets = await MarketService.getMarketsByCity(city);

      res.json({
        status: 'SUCCESS',
        data: markets
      });
    } catch (error) {
      console.error('Erro ao buscar mercados por cidade:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar mercados próximos
  static async getNearbyMarkets(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude, radius = '10', limit = '20' } = req.query;

      if (!latitude || !longitude) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Latitude e longitude são obrigatórias'
        });
        return;
      }

      const markets = await MarketService.getNearbyMarkets(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        parseFloat(radius as string),
        parseInt(limit as string)
      );

      res.json({
        status: 'SUCCESS',
        data: markets
      });
    } catch (error) {
      console.error('Erro ao buscar mercados próximos:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar cidades únicas
  static async getCities(req: Request, res: Response): Promise<void> {
    try {
      const cities = await MarketService.getCities();

      res.json({
        status: 'SUCCESS',
        data: cities
      });
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar estados únicos
  static async getStates(req: Request, res: Response): Promise<void> {
    try {
      const states = await MarketService.getStates();

      res.json({
        status: 'SUCCESS',
        data: states
      });
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar mercados populares
  static async getPopularMarkets(req: Request, res: Response): Promise<void> {
    try {
      const { limit = '10' } = req.query;
      const limitNum = Math.min(parseInt(limit as string) || 10, 50);

      const markets = await MarketService.getPopularMarkets(limitNum);

      res.json({
        status: 'SUCCESS',
        data: markets
      });
    } catch (error) {
      console.error('Erro ao buscar mercados populares:', error);
      res.status(500).json({
        status: 'ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }
}
