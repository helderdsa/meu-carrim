import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ShoppingListsPage from './pages/ShoppingListsPage';
import ShoppingListPage from './pages/ShoppingListPage';
import ProductsPage from './pages/ProductsPage';
import MarketsPage from './pages/MarketsPage';
import ProfilePage from './pages/ProfilePage';

// Componentes
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Rotas públicas */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
            } 
          />

          {/* Rotas protegidas */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="" element={<Navigate to="/dashboard" replace />} />
            <Route element={<Layout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="shopping-lists" element={<ShoppingListsPage />} />
              <Route path="shopping-lists/:id" element={<ShoppingListPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="markets" element={<MarketsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Rota 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
