import { prisma } from '../index';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
  ProductSearchQuery
} from '../types/product.types';

export class ProductService {
  // Criar produto
  static async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
    // Verificar se categoria existe (se fornecida)
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId }
      });

      if (!category) {
        throw new Error('Categoria não encontrada');
      }
    }

    // Verificar se produto já existe
    const existingProduct = await prisma.product.findFirst({
      where: { name: data.name }
    });

    if (existingProduct) {
      throw new Error('Produto com este nome já existe');
    }

    const product = await prisma.product.create({
      data,
      include: {
        category: true,
        priceHistory: {
          include: {
            market: true
          },
          orderBy: { purchaseDate: 'desc' },
          take: 5
        }
      }
    });

    return this.formatProductResponse(product);
  }

  // Buscar todos os produtos com filtros
  static async getProducts(query: ProductSearchQuery): Promise<{
    products: ProductResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { search, categoryId, page = 1, limit = 20 } = query;
    
    const skip = (page - 1) * limit;
    
    const whereClause: any = {};

    if (search) {
      whereClause.name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          priceHistory: {
            include: {
              market: true
            },
            orderBy: { purchaseDate: 'desc' },
            take: 3
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where: whereClause })
    ]);

    return {
      products: products.map(product => this.formatProductResponse(product)),
      total,
      page,
      limit
    };
  }

  // Buscar produto por ID
  static async getProductById(id: string): Promise<ProductResponse | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        priceHistory: {
          include: {
            market: true
          },
          orderBy: { purchaseDate: 'desc' },
          take: 10
        }
      }
    });

    if (!product) return null;

    return this.formatProductResponse(product);
  }

  // Atualizar produto
  static async updateProduct(id: string, data: UpdateProductRequest): Promise<ProductResponse | null> {
    // Verificar se produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      throw new Error('Produto não encontrado');
    }

    // Verificar se categoria existe (se fornecida)
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId }
      });

      if (!category) {
        throw new Error('Categoria não encontrada');
      }
    }

    // Verificar se nome já existe em outro produto
    if (data.name && data.name !== existingProduct.name) {
      const nameExists = await prisma.product.findFirst({
        where: { 
          name: data.name,
          id: { not: id }
        }
      });

      if (nameExists) {
        throw new Error('Produto com este nome já existe');
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        category: true,
        priceHistory: {
          include: {
            market: true
          },
          orderBy: { purchaseDate: 'desc' },
          take: 5
        }
      }
    });

    return this.formatProductResponse(product);
  }

  // Deletar produto
  static async deleteProduct(id: string): Promise<boolean> {
    try {
      // Verificar se produto está sendo usado em listas
      const productInUse = await prisma.shoppingListItem.findFirst({
        where: { productId: id }
      });

      if (productInUse) {
        throw new Error('Produto não pode ser deletado pois está sendo usado em listas de compras');
      }

      await prisma.product.delete({
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

  // Buscar produtos populares (mais usados em listas)
  static async getPopularProducts(limit: number = 10): Promise<ProductResponse[]> {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        shoppingListItems: true,
        priceHistory: {
          include: {
            market: true
          },
          orderBy: { purchaseDate: 'desc' },
          take: 3
        }
      }
    });

    // Ordenar por número de vezes usado em listas
    const sortedProducts = products
      .sort((a, b) => b.shoppingListItems.length - a.shoppingListItems.length)
      .slice(0, limit);

    return sortedProducts.map(product => this.formatProductResponse(product));
  }

  // Buscar produtos por categoria
  static async getProductsByCategory(categoryId: string): Promise<ProductResponse[]> {
    const products = await prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        priceHistory: {
          include: {
            market: true
          },
          orderBy: { purchaseDate: 'desc' },
          take: 3
        }
      },
      orderBy: { name: 'asc' }
    });

    return products.map(product => this.formatProductResponse(product));
  }

  // Buscar produtos sem categoria
  static async getProductsWithoutCategory(): Promise<ProductResponse[]> {
    const products = await prisma.product.findMany({
      where: { categoryId: null },
      include: {
        category: true,
        priceHistory: {
          include: {
            market: true
          },
          orderBy: { purchaseDate: 'desc' },
          take: 3
        }
      },
      orderBy: { name: 'asc' }
    });

    return products.map(product => this.formatProductResponse(product));
  }

  // Adicionar preço histórico
  static async addPriceHistory(
    productId: string, 
    marketId: string, 
    price: number, 
    purchaseDate?: Date
  ): Promise<boolean> {
    try {
      // Verificar se produto e mercado existem
      const [product, market] = await Promise.all([
        prisma.product.findUnique({ where: { id: productId } }),
        prisma.market.findUnique({ where: { id: marketId } })
      ]);

      if (!product || !market) {
        throw new Error('Produto ou mercado não encontrado');
      }

      await prisma.priceHistory.create({
        data: {
          productId,
          marketId,
          price,
          purchaseDate: purchaseDate || new Date()
        }
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  // Função auxiliar de formatação
  private static formatProductResponse(product: any): ProductResponse {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        color: product.category.color,
        icon: product.category.icon
      } : undefined,
      priceHistory: product.priceHistory?.map((history: any) => ({
        id: history.id,
        price: parseFloat(history.price.toString()),
        purchaseDate: history.purchaseDate,
        market: {
          id: history.market.id,
          name: history.market.name
        }
      }))
    };
  }
}
