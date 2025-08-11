export interface CreateMarketRequest {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateMarketRequest {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface MarketResponse {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
  priceHistoryCount?: number;
}

export interface MarketSearchQuery {
  search?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // em km
  limit?: number;
  page?: number;
}
