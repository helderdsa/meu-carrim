import axios from 'axios';
import type { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  User,
  ShoppingList,
  CreateShoppingListRequest,
  ShoppingListItem,
  CreateShoppingListItemRequest,
  Product,
  CreateProductRequest,
  ProductSearchParams,
  Category,
  CreateCategoryRequest,
  Market,
  CreateMarketRequest,
  MarketSearchParams,
  PriceHistory,
  CreatePriceHistoryRequest,
  PriceHistorySearchParams,
  PaginatedResponse
} from '../types';

// Configuração base do Axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de Autenticação
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/users/login', data);
    return response.data.data!;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/users/register', data);
    return response.data.data!;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/users/profile');
    return response.data.data!;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/users/profile', data);
    return response.data.data!;
  },
};

// Serviços de Listas de Compras
export const shoppingListService = {
  getAll: async (): Promise<ShoppingList[]> => {
    const response = await api.get<ApiResponse<ShoppingList[]>>('/shopping-lists');
    return response.data.data!;
  },

  getById: async (id: string): Promise<ShoppingList> => {
    const response = await api.get<ApiResponse<ShoppingList>>(`/shopping-lists/${id}`);
    return response.data.data!;
  },

  create: async (data: CreateShoppingListRequest): Promise<ShoppingList> => {
    const response = await api.post<ApiResponse<ShoppingList>>('/shopping-lists', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateShoppingListRequest>): Promise<ShoppingList> => {
    const response = await api.put<ApiResponse<ShoppingList>>(`/shopping-lists/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/shopping-lists/${id}`);
  },

  duplicate: async (id: string): Promise<ShoppingList> => {
    const response = await api.post<ApiResponse<ShoppingList>>(`/shopping-lists/${id}/duplicate`);
    return response.data.data!;
  },

  // Itens da lista
  addItem: async (listId: string, data: CreateShoppingListItemRequest): Promise<ShoppingListItem> => {
    const response = await api.post<ApiResponse<ShoppingListItem>>(`/shopping-lists/${listId}/items`, data);
    return response.data.data!;
  },

  updateItem: async (listId: string, itemId: string, data: Partial<CreateShoppingListItemRequest>): Promise<ShoppingListItem> => {
    const response = await api.put<ApiResponse<ShoppingListItem>>(`/shopping-lists/${listId}/items/${itemId}`, data);
    return response.data.data!;
  },

  removeItem: async (listId: string, itemId: string): Promise<void> => {
    await api.delete(`/shopping-lists/${listId}/items/${itemId}`);
  },

  toggleItem: async (listId: string, itemId: string): Promise<ShoppingListItem> => {
    const response = await api.patch<ApiResponse<ShoppingListItem>>(`/shopping-lists/${listId}/items/${itemId}/toggle`);
    return response.data.data!;
  },
};

// Serviços de Produtos
export const productService = {
  getAll: async (params?: ProductSearchParams): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params });
    return response.data.data!;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateProductRequest>): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  search: async (query: string): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data.data!;
  },
};

// Serviços de Categorias
export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data!;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data!;
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post<ApiResponse<Category>>('/categories', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateCategoryRequest>): Promise<Category> => {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// Serviços de Mercados
export const marketService = {
  getAll: async (params?: MarketSearchParams): Promise<PaginatedResponse<Market>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Market>>>('/markets', { params });
    return response.data.data!;
  },

  getById: async (id: string): Promise<Market> => {
    const response = await api.get<ApiResponse<Market>>(`/markets/${id}`);
    return response.data.data!;
  },

  create: async (data: CreateMarketRequest): Promise<Market> => {
    const response = await api.post<ApiResponse<Market>>('/markets', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateMarketRequest>): Promise<Market> => {
    const response = await api.put<ApiResponse<Market>>(`/markets/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/markets/${id}`);
  },

  search: async (query: string): Promise<Market[]> => {
    const response = await api.get<ApiResponse<Market[]>>(`/markets/search?q=${encodeURIComponent(query)}`);
    return response.data.data!;
  },

  nearby: async (latitude: number, longitude: number, radius = 10): Promise<Market[]> => {
    const response = await api.get<ApiResponse<Market[]>>(`/markets/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
    return response.data.data!;
  },
};

// Serviços de Histórico de Preços
export const priceHistoryService = {
  getAll: async (params?: PriceHistorySearchParams): Promise<PaginatedResponse<PriceHistory>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<PriceHistory>>>('/price-history', { params });
    return response.data.data!;
  },

  getById: async (id: string): Promise<PriceHistory> => {
    const response = await api.get<ApiResponse<PriceHistory>>(`/price-history/${id}`);
    return response.data.data!;
  },

  create: async (data: CreatePriceHistoryRequest): Promise<PriceHistory> => {
    const response = await api.post<ApiResponse<PriceHistory>>('/price-history', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreatePriceHistoryRequest>): Promise<PriceHistory> => {
    const response = await api.put<ApiResponse<PriceHistory>>(`/price-history/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/price-history/${id}`);
  },

  getProductAverage: async (productId: string, days = 30): Promise<{ averagePrice: number }> => {
    const response = await api.get<ApiResponse<{ averagePrice: number }>>(`/price-history/product/${productId}/average?days=${days}`);
    return response.data.data!;
  },

  getProductLowest: async (productId: string, days = 30): Promise<{ price: number; market: Market; date: string }> => {
    const response = await api.get<ApiResponse<{ price: number; market: Market; date: string }>>(`/price-history/product/${productId}/lowest?days=${days}`);
    return response.data.data!;
  },

  compareMarkets: async (productId: string, days = 30): Promise<{ market: Market; averagePrice: number; lowestPrice: number; priceCount: number }[]> => {
    const response = await api.get<ApiResponse<{ market: Market; averagePrice: number; lowestPrice: number; priceCount: number }[]>>(`/price-history/product/${productId}/markets?days=${days}`);
    return response.data.data!;
  },
};

export default api;
