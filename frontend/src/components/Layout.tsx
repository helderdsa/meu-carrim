import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo no topo */}
      <Header />
      
      {/* Conteúdo principal com padding para header e bottom nav */}
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      
      {/* Navegação inferior fixa */}
      <BottomNavigation />
    </div>
  );
}
