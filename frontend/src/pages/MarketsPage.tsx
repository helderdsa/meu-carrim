import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  Navigation, 
  Clock,
  Star
} from 'lucide-react';
import { marketService } from '../services/api';
import type { Market } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    loadMarkets();
    getUserLocation();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const handleSearch = async () => {
        if (searchTerm) {
          try {
            const response = await marketService.search(searchTerm);
            setMarkets(response || []);
          } catch (err) {
            setError('Erro ao buscar mercados');
            console.error('Erro na busca:', err);
          }
        } else {
          loadMarkets();
        }
      };

      handleSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Erro ao obter localização:', error);
        }
      );
    }
  };

  const loadMarkets = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await marketService.getAll();
      setMarkets(response.data || []);
    } catch (err) {
      setError('Erro ao carregar mercados');
      console.error('Erro ao carregar mercados:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistance = (market: Market): number | null => {
    if (!userLocation || !market.latitude || !market.longitude) {
      return null;
    }

    const R = 6371; // Raio da Terra em km
    const dLat = (market.latitude - userLocation.lat) * Math.PI / 180;
    const dLng = (market.longitude - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(market.latitude * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Arredondar para 1 casa decimal
  };

  const openInMaps = (market: Market) => {
    if (market.latitude && market.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${market.latitude},${market.longitude}`;
      window.open(url, '_blank');
    } else if (market.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(market.address)}`;
      window.open(url, '_blank');
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
          <h1 className="text-2xl font-bold text-gray-900">Mercados</h1>
          <p className="text-gray-600">Encontre os melhores mercados próximos a você</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Novo Mercado</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={loadMarkets}
            className="ml-2 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar mercados por nome ou localização..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {markets.length} {markets.length === 1 ? 'mercado encontrado' : 'mercados encontrados'}
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Limpar busca
          </button>
        )}
      </div>

      {/* Markets List */}
      {markets.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhum mercado encontrado' : 'Nenhum mercado cadastrado'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Tente ajustar os termos de busca'
              : 'Cadastre o primeiro mercado para começar'
            }
          </p>
          {!searchTerm && (
            <button className="btn-primary inline-flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Cadastrar primeiro mercado
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {markets.map((market) => {
            const distance = calculateDistance(market);
            
            return (
              <div
                key={market.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Name and Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg truncate">
                        {market.name}
                      </h3>
                      {/* Placeholder for rating */}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.2</span>
                      </div>
                    </div>

                    {/* Description */}
                    {market.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {market.description}
                      </p>
                    )}

                    {/* Location Info */}
                    <div className="space-y-2">
                      {market.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{market.address}</span>
                        </div>
                      )}
                      
                      {(market.city || market.state) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="h-4 w-4 flex-shrink-0" /> {/* Spacer */}
                          <span>
                            {market.city && market.state 
                              ? `${market.city}, ${market.state}`
                              : market.city || market.state
                            }
                          </span>
                        </div>
                      )}

                      {distance && (
                        <div className="flex items-center gap-2 text-sm text-primary-600">
                          <Navigation className="h-4 w-4 flex-shrink-0" />
                          <span>{distance} km de distância</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => openInMaps(market)}
                        className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <MapPin className="h-4 w-4" />
                        Ver no mapa
                      </button>
                      
                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-700 font-medium">
                        <Clock className="h-4 w-4" />
                        Horários
                      </button>

                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-700 font-medium">
                        <Star className="h-4 w-4" />
                        Avaliar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
