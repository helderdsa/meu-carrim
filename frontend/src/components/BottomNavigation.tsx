import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Package, 
  MapPin, 
  User
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Início',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Listas',
    href: '/shopping-lists',
    icon: ShoppingBag,
  },
  {
    name: 'Produtos',
    href: '/products',
    icon: Package,
  },
  {
    name: 'Mercados',
    href: '/markets',
    icon: MapPin,
  },
  {
    name: 'Perfil',
    href: '/profile',
    icon: User,
  },
];

export default function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 text-center transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
