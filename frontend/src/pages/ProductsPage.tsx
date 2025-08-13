import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Package, 
  Tag, 
  Grid3x3, 
  List,
  Image as ImageIcon
} from 'lucide-react';
import { productService, categoryService } from '../services/api';
import type { Product, Category } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const handleSearch = async () => {
        if (searchTerm) {
          try {
            const response = await productService.search(searchTerm);
            setProducts(response || []);
          } catch (err) {
            setError('Erro ao buscar produtos');
            console.error('Erro na busca:', err);
          }
        } else if (selectedCategory) {
          try {
            const response = await productService.getAll({ categoryId: selectedCategory });
            setProducts(response.data || []);
          } catch (err) {
            setError('Erro ao carregar produtos da categoria');
            console.error('Erro na busca por categoria:', err);
          }
        } else {
          try {
            const response = await productService.getAll();
            setProducts(response.data || []);
          } catch (err) {
            setError('Erro ao carregar produtos');
            console.error('Erro ao carregar produtos:', err);
          }
        }
      };

      handleSearch();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);

      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse || []);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Gerencie seu catálogo de produtos</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Novo Produto</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={loadInitialData}
            className="ml-2 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>
        {(searchTerm || selectedCategory) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
            }}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Products Grid/List */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory 
              ? 'Tente ajustar os filtros de busca'
              : 'Cadastre seu primeiro produto para começar'
            }
          </p>
          {!searchTerm && !selectedCategory && (
            <button className="btn-primary inline-flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Cadastrar primeiro produto
            </button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        }>
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'p-4' : 'overflow-hidden'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <Tag className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {product.category.name}
                      </span>
                    </div>
                    
                    {product.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-1">
                      <Tag className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {product.category.name}
                      </span>
                    </div>
                    
                    {product.description && (
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
