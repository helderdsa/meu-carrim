// Tipos base
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category: Category;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Market {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price?: number;
  unit: string;
  purchased: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingList {
  id: string;
  title: string;
  description?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  userId: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceHistory {
  id: string;
  price: number;
  productId: string;
  product: Product;
  marketId: string;
  market: Market;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateShoppingListRequest {
  title: string;
  description?: string;
}

export interface CreateShoppingListItemRequest {
  productId: string;
  quantity: number;
  price?: number;
  unit: string;
  notes?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  categoryId: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface CreateMarketRequest {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreatePriceHistoryRequest {
  price: number;
  productId: string;
  marketId: string;
  purchaseDate?: string;
}

// Tipos para responses da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Tipos para filtros e queries
export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
}

export interface ProductSearchParams extends SearchParams {
  categoryId?: string;
}

export interface MarketSearchParams extends SearchParams {
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface PriceHistorySearchParams extends SearchParams {
  productId?: string;
  marketId?: string;
  startDate?: string;
  endDate?: string;
}
