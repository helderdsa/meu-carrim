export interface CreatePriceHistoryRequest {
  productId: string;
  marketId: string;
  price: number;
  purchaseDate?: Date;
}

export interface UpdatePriceHistoryRequest {
  price?: number;
  purchaseDate?: Date;
}

export interface PriceHistoryResponse {
  id: string;
  price: number;
  purchaseDate: Date;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    image?: string;
  };
  market: {
    id: string;
    name: string;
    city?: string;
  };
}

export interface PriceHistoryQuery {
  productId?: string;
  marketId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}
