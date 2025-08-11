export interface CreateProductRequest {
  name: string;
  description?: string;
  image?: string;
  categoryId?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  image?: string;
  categoryId?: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  };
  priceHistory?: PriceHistoryResponse[];
}

export interface PriceHistoryResponse {
  id: string;
  price: number;
  purchaseDate: Date;
  market: {
    id: string;
    name: string;
  };
}

export interface ProductSearchQuery {
  search?: string;
  categoryId?: string;
  limit?: number;
  page?: number;
}
