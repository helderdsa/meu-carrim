import { prisma } from '../index';
import {
  CreateShoppingListRequest,
  UpdateShoppingListRequest,
  AddItemToListRequest,
  UpdateShoppingListItemRequest,
  ShoppingListResponse,
  ShoppingListItemResponse
} from '../types/shopping-list.types';

export class ShoppingListService {
  // Criar nova lista de compras
  static async createShoppingList(userId: string, data: CreateShoppingListRequest): Promise<ShoppingListResponse> {
    const shoppingList = await prisma.shoppingList.create({
      data: {
        ...data,
        userId
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    return this.formatShoppingListResponse(shoppingList);
  }

  // Buscar todas as listas do usuário
  static async getUserShoppingLists(userId: string): Promise<ShoppingListResponse[]> {
    const shoppingLists = await prisma.shoppingList.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return shoppingLists.map(list => this.formatShoppingListResponse(list));
  }

  // Buscar lista por ID
  static async getShoppingListById(id: string, userId?: string): Promise<ShoppingListResponse | null> {
    const whereClause: any = { id };
    if (userId) {
      whereClause.userId = userId;
    }

    const shoppingList = await prisma.shoppingList.findFirst({
      where: whereClause,
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    if (!shoppingList) return null;

    return this.formatShoppingListResponse(shoppingList);
  }

  // Atualizar lista de compras
  static async updateShoppingList(
    id: string, 
    userId: string, 
    data: UpdateShoppingListRequest
  ): Promise<ShoppingListResponse | null> {
    try {
      const shoppingList = await prisma.shoppingList.update({
        where: { id, userId },
        data: {
          ...data,
          updatedAt: new Date()
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      });

      return this.formatShoppingListResponse(shoppingList);
    } catch (error) {
      return null;
    }
  }

  // Deletar lista de compras
  static async deleteShoppingList(id: string, userId: string): Promise<boolean> {
    try {
      await prisma.shoppingList.delete({
        where: { id, userId }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Adicionar item à lista
  static async addItemToList(
    listId: string, 
    userId: string, 
    data: AddItemToListRequest
  ): Promise<ShoppingListItemResponse | null> {
    // Verificar se a lista pertence ao usuário
    const list = await prisma.shoppingList.findFirst({
      where: { id: listId, userId }
    });

    if (!list) return null;

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: data.productId }
    });

    if (!product) return null;

    try {
      const item = await prisma.shoppingListItem.create({
        data: {
          shoppingListId: listId,
          productId: data.productId,
          quantity: data.quantity || 1,
          notes: data.notes,
          estimatedPrice: data.estimatedPrice
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      });

      return this.formatShoppingListItemResponse(item);
    } catch (error) {
      // Item já existe na lista
      return null;
    }
  }

  // Atualizar item da lista
  static async updateListItem(
    itemId: string, 
    userId: string, 
    data: UpdateShoppingListItemRequest
  ): Promise<ShoppingListItemResponse | null> {
    try {
      const item = await prisma.shoppingListItem.update({
        where: {
          id: itemId,
          shoppingList: {
            userId
          }
        },
        data,
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      });

      return this.formatShoppingListItemResponse(item);
    } catch (error) {
      return null;
    }
  }

  // Remover item da lista
  static async removeItemFromList(itemId: string, userId: string): Promise<boolean> {
    try {
      await prisma.shoppingListItem.delete({
        where: {
          id: itemId,
          shoppingList: {
            userId
          }
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Marcar/desmarcar item como comprado
  static async toggleItemPurchased(itemId: string, userId: string): Promise<ShoppingListItemResponse | null> {
    try {
      const currentItem = await prisma.shoppingListItem.findFirst({
        where: {
          id: itemId,
          shoppingList: {
            userId
          }
        }
      });

      if (!currentItem) return null;

      const item = await prisma.shoppingListItem.update({
        where: { id: itemId },
        data: {
          isPurchased: !currentItem.isPurchased
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      });

      return this.formatShoppingListItemResponse(item);
    } catch (error) {
      return null;
    }
  }

  // Duplicar lista de compras
  static async duplicateShoppingList(id: string, userId: string): Promise<ShoppingListResponse | null> {
    const originalList = await prisma.shoppingList.findFirst({
      where: { id, userId },
      include: {
        items: true
      }
    });

    if (!originalList) return null;

    try {
      const newList = await prisma.shoppingList.create({
        data: {
          name: `${originalList.name} (Cópia)`,
          description: originalList.description,
          userId,
          items: {
            create: originalList.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              notes: item.notes,
              estimatedPrice: item.estimatedPrice,
              isPurchased: false
            }))
          }
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      });

      return this.formatShoppingListResponse(newList);
    } catch (error) {
      return null;
    }
  }

  // Buscar listas públicas ou compartilhadas (para admin)
  static async getAllShoppingLists(): Promise<ShoppingListResponse[]> {
    const shoppingLists = await prisma.shoppingList.findMany({
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return shoppingLists.map(list => this.formatShoppingListResponse(list));
  }

  // Funções auxiliares de formatação
  private static formatShoppingListResponse(list: any): ShoppingListResponse {
    return {
      id: list.id,
      name: list.name,
      description: list.description,
      isCompleted: list.isCompleted,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      userId: list.userId,
      itemCount: list.items?.length || 0,
      items: list.items?.map((item: any) => this.formatShoppingListItemResponse(item))
    };
  }

  private static formatShoppingListItemResponse(item: any): ShoppingListItemResponse {
    return {
      id: item.id,
      quantity: item.quantity,
      isPurchased: item.isPurchased,
      notes: item.notes,
      estimatedPrice: item.estimatedPrice ? parseFloat(item.estimatedPrice.toString()) : undefined,
      product: {
        id: item.product.id,
        name: item.product.name,
        image: item.product.image,
        category: item.product.category ? {
          id: item.product.category.id,
          name: item.product.category.name,
          color: item.product.category.color,
          icon: item.product.category.icon
        } : undefined
      }
    };
  }
}
