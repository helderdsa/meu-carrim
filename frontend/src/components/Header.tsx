import { User, LogOut, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Meu Carrim
            </span>
          </div>

          {/* Menu do usuário */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">
                {user?.name}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
