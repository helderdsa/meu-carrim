import { prisma } from '../index';
import {
  CreateMarketRequest,
  UpdateMarketRequest,
  MarketResponse,
  MarketSearchQuery
} from '../types/market.types';

export class MarketService {
  // Criar mercado
  static async createMarket(data: CreateMarketRequest): Promise<MarketResponse> {
    // Verificar se mercado já existe com mesmo nome e cidade
    const existingMarket = await prisma.market.findFirst({
      where: { 
        name: data.name,
        city: data.city || undefined
      }
    });

    if (existingMarket) {
      throw new Error('Mercado com este nome já existe nesta cidade');
    }

    const market = await prisma.market.create({
      data,
      include: {
        priceHistory: true
      }
    });

    return this.formatMarketResponse(market);
  }

  // Buscar mercados com filtros
  static async getMarkets(query: MarketSearchQuery): Promise<{
    markets: MarketResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { search, city, state, latitude, longitude, radius, page = 1, limit = 20 } = query;
    
    const skip = (page - 1) * limit;
    
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
        { city: { contains: search } }
      ];
    }

    if (city) {
      whereClause.city = { contains: city };
    }

    if (state) {
      whereClause.state = { contains: state };
    }

    // Filtro por proximidade (se coordenadas fornecidas)
    let nearbyMarkets: any[] = [];
    if (latitude && longitude && radius) {
      // Buscar mercados próximos usando fórmula de distância
      const allMarkets = await prisma.market.findMany({
        where: {
          ...whereClause,
          latitude: { not: null },
          longitude: { not: null }
        }
      });

      nearbyMarkets = allMarkets.filter(market => {
        if (!market.latitude || !market.longitude) return false;
        const distance = this.calculateDistance(
          latitude, longitude,
          market.latitude, market.longitude
        );
        return distance <= radius;
      });
    }

    let markets;
    let total;

    if (nearbyMarkets.length > 0) {
      // Se temos filtro de proximidade, usar os mercados próximos
      const nearbyIds = nearbyMarkets.map(m => m.id);
      [markets, total] = await Promise.all([
        prisma.market.findMany({
          where: { id: { in: nearbyIds } },
          include: { priceHistory: true },
          orderBy: { name: 'asc' },
          skip,
          take: limit
        }),
        Promise.resolve(nearbyMarkets.length)
      ]);
    } else {
      // Busca normal sem filtro de proximidade
      [markets, total] = await Promise.all([
        prisma.market.findMany({
          where: whereClause,
          include: { priceHistory: true },
          orderBy: { name: 'asc' },
          skip,
          take: limit
        }),
        prisma.market.count({ where: whereClause })
      ]);
    }

    return {
      markets: markets.map(market => this.formatMarketResponse(market)),
      total,
      page,
      limit
    };
  }

  // Buscar mercado por ID
  static async getMarketById(id: string): Promise<MarketResponse | null> {
    const market = await prisma.market.findUnique({
      where: { id },
      include: {
        priceHistory: {
          include: {
            product: true
          },
          orderBy: { purchaseDate: 'desc' },
          take: 10
        }
      }
    });

    if (!market) return null;

    return this.formatMarketResponse(market);
  }

  // Atualizar mercado
  static async updateMarket(id: string, data: UpdateMarketRequest): Promise<MarketResponse | null> {
    // Verificar se mercado existe
    const existingMarket = await prisma.market.findUnique({
      where: { id }
    });

    if (!existingMarket) {
      throw new Error('Mercado não encontrado');
    }

    // Verificar se nome já existe em outro mercado na mesma cidade
    if (data.name && (data.name !== existingMarket.name || data.city !== existingMarket.city)) {
      const nameExists = await prisma.market.findFirst({
        where: { 
          name: data.name,
          city: data.city || existingMarket.city,
          id: { not: id }
        }
      });

      if (nameExists) {
        throw new Error('Mercado com este nome já existe nesta cidade');
      }
    }

    const market = await prisma.market.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        priceHistory: true
      }
    });

    return this.formatMarketResponse(market);
  }

  // Deletar mercado
  static async deleteMarket(id: string): Promise<boolean> {
    try {
      // Verificar se mercado tem histórico de preços
      const marketWithHistory = await prisma.market.findUnique({
        where: { id },
        include: {
          priceHistory: true
        }
      });

      if (!marketWithHistory) {
        throw new Error('Mercado não encontrado');
      }

      if (marketWithHistory.priceHistory.length > 0) {
        throw new Error('Mercado não pode ser deletado pois possui histórico de preços');
      }

      await prisma.market.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return false;
    }
  }

  // Deletar mercado e todo seu histórico
  static async forceDeleteMarket(id: string): Promise<boolean> {
    try {
      // Deletar histórico de preços primeiro
      await prisma.priceHistory.deleteMany({
        where: { marketId: id }
      });

      // Deletar mercado
      await prisma.market.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  // Buscar mercados por cidade
  static async getMarketsByCity(city: string): Promise<MarketResponse[]> {
    const markets = await prisma.market.findMany({
      where: { 
        city: { contains: city }
      },
      include: {
        priceHistory: true
      },
      orderBy: { name: 'asc' }
    });

    return markets.map(market => this.formatMarketResponse(market));
  }

  // Buscar mercados próximos
  static async getNearbyMarkets(
    latitude: number,
    longitude: number,
    radius: number = 10,
    limit: number = 20
  ): Promise<MarketResponse[]> {
    // Buscar todos os mercados com coordenadas
    const allMarkets = await prisma.market.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null }
      },
      include: {
        priceHistory: true
      }
    });

    // Filtrar por distância e ordenar
    const nearbyMarkets = allMarkets
      .filter(market => {
        if (!market.latitude || !market.longitude) return false;
        const distance = this.calculateDistance(
          latitude, longitude,
          market.latitude, market.longitude
        );
        return distance <= radius;
      })
      .sort((a, b) => {
        const distA = this.calculateDistance(latitude, longitude, a.latitude!, a.longitude!);
        const distB = this.calculateDistance(latitude, longitude, b.latitude!, b.longitude!);
        return distA - distB;
      })
      .slice(0, limit);

    return nearbyMarkets.map(market => this.formatMarketResponse(market));
  }

  // Buscar cidades únicas
  static async getCities(): Promise<string[]> {
    const markets = await prisma.market.findMany({
      select: { city: true },
      where: { city: { not: null } },
      distinct: ['city']
    });

    return markets
      .map(market => market.city)
      .filter(city => city !== null)
      .sort() as string[];
  }

  // Buscar estados únicos
  static async getStates(): Promise<string[]> {
    const markets = await prisma.market.findMany({
      select: { state: true },
      where: { state: { not: null } },
      distinct: ['state']
    });

    return markets
      .map(market => market.state)
      .filter(state => state !== null)
      .sort() as string[];
  }

  // Buscar mercados populares (com mais histórico de preços)
  static async getPopularMarkets(limit: number = 10): Promise<MarketResponse[]> {
    const markets = await prisma.market.findMany({
      include: {
        priceHistory: true
      }
    });

    // Ordenar por número de registros de preços
    const sortedMarkets = markets
      .sort((a, b) => b.priceHistory.length - a.priceHistory.length)
      .slice(0, limit);

    return sortedMarkets.map(market => this.formatMarketResponse(market));
  }

  // Calcular distância entre duas coordenadas (fórmula de Haversine)
  private static calculateDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Função auxiliar de formatação
  private static formatMarketResponse(market: any): MarketResponse {
    return {
      id: market.id,
      name: market.name,
      address: market.address,
      city: market.city,
      state: market.state,
      zipCode: market.zipCode,
      latitude: market.latitude ? parseFloat(market.latitude.toString()) : undefined,
      longitude: market.longitude ? parseFloat(market.longitude.toString()) : undefined,
      createdAt: market.createdAt,
      updatedAt: market.updatedAt,
      priceHistoryCount: market.priceHistory?.length || 0
    };
  }
}
