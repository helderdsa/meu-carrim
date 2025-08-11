import { prisma } from '../index';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse
} from '../types/category.types';

export class CategoryService {
  // Criar categoria
  static async createCategory(data: CreateCategoryRequest): Promise<CategoryResponse> {
    // Verificar se categoria já existe
    const existingCategory = await prisma.category.findUnique({
      where: { name: data.name }
    });

    if (existingCategory) {
      throw new Error('Categoria com este nome já existe');
    }

    const category = await prisma.category.create({
      data,
      include: {
        products: true
      }
    });

    return this.formatCategoryResponse(category);
  }

  // Buscar todas as categorias
  static async getCategories(): Promise<CategoryResponse[]> {
    const categories = await prisma.category.findMany({
      include: {
        products: true
      },
      orderBy: { name: 'asc' }
    });

    return categories.map(category => this.formatCategoryResponse(category));
  }

  // Buscar categoria por ID
  static async getCategoryById(id: string): Promise<CategoryResponse | null> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true
      }
    });

    if (!category) return null;

    return this.formatCategoryResponse(category);
  }

  // Atualizar categoria
  static async updateCategory(id: string, data: UpdateCategoryRequest): Promise<CategoryResponse | null> {
    // Verificar se categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      throw new Error('Categoria não encontrada');
    }

    // Verificar se nome já existe em outra categoria
    if (data.name && data.name !== existingCategory.name) {
      const nameExists = await prisma.category.findFirst({
        where: { 
          name: data.name,
          id: { not: id }
        }
      });

      if (nameExists) {
        throw new Error('Categoria com este nome já existe');
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        products: true
      }
    });

    return this.formatCategoryResponse(category);
  }

  // Deletar categoria
  static async deleteCategory(id: string): Promise<boolean> {
    try {
      // Verificar se categoria tem produtos
      const categoryWithProducts = await prisma.category.findUnique({
        where: { id },
        include: {
          products: true
        }
      });

      if (!categoryWithProducts) {
        throw new Error('Categoria não encontrada');
      }

      if (categoryWithProducts.products.length > 0) {
        throw new Error('Categoria não pode ser deletada pois possui produtos associados');
      }

      await prisma.category.delete({
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

  // Remover categoria de todos os produtos (definir como null)
  static async removeCategoryFromProducts(id: string): Promise<boolean> {
    try {
      await prisma.product.updateMany({
        where: { categoryId: id },
        data: { categoryId: null }
      });

      await prisma.category.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  // Buscar categorias mais usadas
  static async getPopularCategories(limit: number = 10): Promise<CategoryResponse[]> {
    const categories = await prisma.category.findMany({
      include: {
        products: true
      }
    });

    // Ordenar por número de produtos
    const sortedCategories = categories
      .sort((a, b) => b.products.length - a.products.length)
      .slice(0, limit);

    return sortedCategories.map(category => this.formatCategoryResponse(category));
  }

  // Função auxiliar de formatação
  private static formatCategoryResponse(category: any): CategoryResponse {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      productCount: category.products?.length || 0
    };
  }
}
