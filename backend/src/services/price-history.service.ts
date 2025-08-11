import { prisma } from '../index';
import {
  CreatePriceHistoryRequest,
  UpdatePriceHistoryRequest,
  PriceHistoryResponse,
  PriceHistoryQuery
} from '../types/price-history.types';

export class PriceHistoryService {
  // Criar registro de preço
  static async createPriceHistory(data: CreatePriceHistoryRequest): Promise<PriceHistoryResponse> {
    // Verificar se produto e mercado existem
    const [product, market] = await Promise.all([
      prisma.product.findUnique({ where: { id: data.productId } }),
      prisma.market.findUnique({ where: { id: data.marketId } })
    ]);

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    if (!market) {
      throw new Error('Mercado não encontrado');
    }

    const priceHistory = await prisma.priceHistory.create({
      data: {
        ...data,
        purchaseDate: data.purchaseDate || new Date()
      },
      include: {
        product: true,
        market: true
      }
    });

    return this.formatPriceHistoryResponse(priceHistory);
  }

  // Buscar histórico de preços com filtros
  static async getPriceHistory(query: PriceHistoryQuery): Promise<{
    priceHistory: PriceHistoryResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { productId, marketId, startDate, endDate, page = 1, limit = 20 } = query;
    
    const skip = (page - 1) * limit;
    
    const whereClause: any = {};

    if (productId) {
      whereClause.productId = productId;
    }

    if (marketId) {
      whereClause.marketId = marketId;
    }

    if (startDate || endDate) {
      whereClause.purchaseDate = {};
      if (startDate) {
        whereClause.purchaseDate.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.purchaseDate.lte = new Date(endDate);
      }
    }

    const [priceHistory, total] = await Promise.all([
      prisma.priceHistory.findMany({
        where: whereClause,
        include: {
          product: true,
          market: true
        },
        orderBy: { purchaseDate: 'desc' },
        skip,
        take: limit
      }),
      prisma.priceHistory.count({ where: whereClause })
    ]);

    return {
      priceHistory: priceHistory.map(ph => this.formatPriceHistoryResponse(ph)),
      total,
      page,
      limit
    };
  }

  // Buscar histórico por ID
  static async getPriceHistoryById(id: string): Promise<PriceHistoryResponse | null> {
    const priceHistory = await prisma.priceHistory.findUnique({
      where: { id },
      include: {
        product: true,
        market: true
      }
    });

    if (!priceHistory) return null;

    return this.formatPriceHistoryResponse(priceHistory);
  }

  // Atualizar registro de preço
  static async updatePriceHistory(id: string, data: UpdatePriceHistoryRequest): Promise<PriceHistoryResponse | null> {
    try {
      const priceHistory = await prisma.priceHistory.update({
        where: { id },
        data,
        include: {
          product: true,
          market: true
        }
      });

      return this.formatPriceHistoryResponse(priceHistory);
    } catch (error) {
      return null;
    }
  }

  // Deletar registro de preço
  static async deletePriceHistory(id: string): Promise<boolean> {
    try {
      await prisma.priceHistory.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Buscar histórico de preços de um produto
  static async getProductPriceHistory(productId: string, limit: number = 10): Promise<PriceHistoryResponse[]> {
    const priceHistory = await prisma.priceHistory.findMany({
      where: { productId },
      include: {
        product: true,
        market: true
      },
      orderBy: { purchaseDate: 'desc' },
      take: limit
    });

    return priceHistory.map(ph => this.formatPriceHistoryResponse(ph));
  }

  // Buscar histórico de preços de um mercado
  static async getMarketPriceHistory(marketId: string, limit: number = 10): Promise<PriceHistoryResponse[]> {
    const priceHistory = await prisma.priceHistory.findMany({
      where: { marketId },
      include: {
        product: true,
        market: true
      },
      orderBy: { purchaseDate: 'desc' },
      take: limit
    });

    return priceHistory.map(ph => this.formatPriceHistoryResponse(ph));
  }

  // Obter preço médio de um produto
  static async getProductAveragePrice(productId: string, days: number = 30): Promise<number | null> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await prisma.priceHistory.aggregate({
      where: {
        productId,
        purchaseDate: {
          gte: startDate
        }
      },
      _avg: {
        price: true
      }
    });

    return result._avg.price ? parseFloat(result._avg.price.toString()) : null;
  }

  // Obter menor preço de um produto
  static async getProductLowestPrice(productId: string, days: number = 30): Promise<{
    price: number;
    market: { id: string; name: string; city?: string };
    date: Date;
  } | null> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const lowestPrice = await prisma.priceHistory.findFirst({
      where: {
        productId,
        purchaseDate: {
          gte: startDate
        }
      },
      include: {
        market: true
      },
      orderBy: { price: 'asc' }
    });

    if (!lowestPrice) return null;

    return {
      price: parseFloat(lowestPrice.price.toString()),
      market: {
        id: lowestPrice.market.id,
        name: lowestPrice.market.name,
        city: lowestPrice.market.city || undefined
      },
      date: lowestPrice.purchaseDate
    };
  }

  // Comparar preços entre mercados para um produto
  static async compareProductPricesAcrossMarkets(productId: string, days: number = 30): Promise<{
    marketId: string;
    marketName: string;
    city?: string;
    averagePrice: number;
    lowestPrice: number;
    highestPrice: number;
    priceCount: number;
  }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const priceHistory = await prisma.priceHistory.findMany({
      where: {
        productId,
        purchaseDate: {
          gte: startDate
        }
      },
      include: {
        market: true
      }
    });

    // Agrupar por mercado
    const marketPrices: { [marketId: string]: number[] } = {};
    const marketInfo: { [marketId: string]: { name: string; city?: string } } = {};

    priceHistory.forEach(ph => {
      const marketId = ph.market.id;
      const price = parseFloat(ph.price.toString());

      if (!marketPrices[marketId]) {
        marketPrices[marketId] = [];
        marketInfo[marketId] = {
          name: ph.market.name,
          city: ph.market.city || undefined
        };
      }

      marketPrices[marketId].push(price);
    });

    // Calcular estatísticas para cada mercado
    return Object.entries(marketPrices).map(([marketId, prices]) => {
      const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const lowestPrice = Math.min(...prices);
      const highestPrice = Math.max(...prices);
      const market = marketInfo[marketId];

      return {
        marketId,
        marketName: market?.name || 'Mercado desconhecido',
        city: market?.city,
        averagePrice: parseFloat(averagePrice.toFixed(2)),
        lowestPrice,
        highestPrice,
        priceCount: prices.length
      };
    }).sort((a, b) => a.averagePrice - b.averagePrice);
  }

  // Função auxiliar de formatação
  private static formatPriceHistoryResponse(priceHistory: any): PriceHistoryResponse {
    return {
      id: priceHistory.id,
      price: parseFloat(priceHistory.price.toString()),
      purchaseDate: priceHistory.purchaseDate,
      createdAt: priceHistory.createdAt,
      product: {
        id: priceHistory.product.id,
        name: priceHistory.product.name,
        image: priceHistory.product.image
      },
      market: {
        id: priceHistory.market.id,
        name: priceHistory.market.name,
        city: priceHistory.market.city
      }
    };
  }
}
