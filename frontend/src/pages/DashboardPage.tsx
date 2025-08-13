import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  MapPin, 
  TrendingUp, 
  Plus, 
  Clock,
  CheckCircle
} from 'lucide-react';
import { shoppingListService, productService, marketService } from '../services/api';
import type { ShoppingList } from '../types';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

interface DashboardStats {
  totalLists: number;
  activeLists: number;
  totalProducts: number;
  totalMarkets: number;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalLists: 0,
    activeLists: 0,
    totalProducts: 0,
    totalMarkets: 0
  });
  const [recentLists, setRecentLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Carregar dados em paralelo
      const [listsResponse, productsResponse, marketsResponse] = await Promise.all([
        shoppingListService.getAll().catch(() => []),
        productService.getAll().catch(() => ({ data: [], total: 0, page: 1, totalPages: 1 })),
        marketService.getAll().catch(() => ({ data: [], total: 0, page: 1, totalPages: 1 }))
      ]);

      const lists = listsResponse || [];
      const products = productsResponse?.data || [];
      const markets = marketsResponse?.data || [];

      setStats({
        totalLists: lists.length,
        activeLists: lists.filter(list => list.status === 'ACTIVE').length,
        totalProducts: products.length,
        totalMarkets: markets.length
      });

      // Pegar as 3 listas mais recentes
      setRecentLists(lists.slice(0, 3));

    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Erro no dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.name || 'Usuário'}! 👋
        </h1>
        <p className="text-gray-600">
          Bem-vindo de volta ao Meu Carrim
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={loadDashboardData}
            className="ml-2 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Listas Ativas</p>
              <p className="text-2xl font-bold text-primary-600">{stats.activeLists}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Listas</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalLists}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Produtos</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mercados</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalMarkets}</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/shopping-lists"
            className="flex flex-col items-center p-4 text-center hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="bg-primary-100 p-3 rounded-full mb-2">
              <Plus className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Nova Lista</span>
          </Link>
          
          <Link
            to="/products"
            className="flex flex-col items-center p-4 text-center hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="bg-green-100 p-3 rounded-full mb-2">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Ver Produtos</span>
          </Link>
          
          <Link
            to="/markets"
            className="flex flex-col items-center p-4 text-center hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="bg-purple-100 p-3 rounded-full mb-2">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Mercados</span>
          </Link>
          
          <Link
            to="/profile"
            className="flex flex-col items-center p-4 text-center hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="bg-blue-100 p-3 rounded-full mb-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Estatísticas</span>
          </Link>
        </div>
      </div>

      {/* Recent Lists */}
      {recentLists.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Listas Recentes</h2>
            <Link 
              to="/shopping-lists"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Ver todas
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentLists.map((list) => {
              const itemCount = list.items?.length || 0;
              const purchasedCount = list.items?.filter(item => item.purchased).length || 0;
              const progress = itemCount > 0 ? (purchasedCount / itemCount) * 100 : 0;

              return (
                <Link
                  key={list.id}
                  to={`/shopping-lists/${list.id}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{list.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(list.createdAt)}</span>
                      </div>
                    </div>
                    {itemCount > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 text-sm text-gray-400">
                    {Math.round(progress)}%
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
