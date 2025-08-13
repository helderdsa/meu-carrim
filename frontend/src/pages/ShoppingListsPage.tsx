import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBag, Calendar, Package, MoreVertical } from 'lucide-react';
import { shoppingListService } from '../services/api';
import type { ShoppingList } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateShoppingListModal from '../components/CreateShoppingListModal';

export default function ShoppingListsPage() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadShoppingLists();
  }, []);

  const loadShoppingLists = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await shoppingListService.getAll();
      setLists(response || []);
    } catch (err) {
      setError('Erro ao carregar listas de compras');
      console.error('Erro ao carregar listas:', err);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativa';
      case 'COMPLETED':
        return 'Concluída';
      case 'ARCHIVED':
        return 'Arquivada';
      default:
        return status;
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listas de Compras</h1>
          <p className="text-gray-600">Organize suas compras de forma inteligente</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Nova Lista</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={loadShoppingLists}
            className="ml-2 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Lists Grid */}
      {lists.length === 0 && !error ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma lista de compras
          </h3>
          <p className="text-gray-600 mb-6">
            Crie sua primeira lista para começar a organizar suas compras
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Criar primeira lista
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {lists.map((list) => {
            const itemCount = list.items?.length || 0;
            const purchasedCount = list.items?.filter(item => item.purchased).length || 0;
            const progress = itemCount > 0 ? (purchasedCount / itemCount) * 100 : 0;

            return (
              <Link
                key={list.id}
                to={`/shopping-lists/${list.id}`}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Title and Status */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {list.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(list.status)}`}>
                        {getStatusText(list.status)}
                      </span>
                    </div>

                    {/* Description */}
                    {list.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {list.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    {itemCount > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{purchasedCount} de {itemCount} itens</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(list.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Implementar menu de ações
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* TODO: Implementar modal de criação de lista */}
      <CreateShoppingListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadShoppingLists}
      />
    </div>
  );
}
