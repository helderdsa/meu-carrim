import { Request } from 'express';

export interface CreateShoppingListRequest {
  name: string;
  description?: string;
}

export interface UpdateShoppingListRequest {
  name?: string;
  description?: string;
  isCompleted?: boolean;
}

export interface ShoppingListResponse {
  id: string;
  name: string;
  description?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  itemCount?: number;
  items?: ShoppingListItemResponse[];
}

export interface ShoppingListItemResponse {
  id: string;
  quantity: number;
  isPurchased: boolean;
  notes?: string;
  estimatedPrice?: number;
  product: {
    id: string;
    name: string;
    image?: string;
    category?: {
      id: string;
      name: string;
      color?: string;
      icon?: string;
    };
  };
}

export interface AddItemToListRequest {
  productId: string;
  quantity?: number;
  notes?: string;
  estimatedPrice?: number;
}

export interface UpdateShoppingListItemRequest {
  quantity?: number;
  isPurchased?: boolean;
  notes?: string;
  estimatedPrice?: number;
}
