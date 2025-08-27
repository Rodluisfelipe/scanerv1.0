import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Shield, Sparkles } from 'lucide-react';

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Si está cargando, mostrar indicador de carga moderno
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          {/* Logo animado */}
          <div className="inline-flex items-center justify-center p-4 mb-6 rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-2xl animate-pulse">
            <Shield className="h-12 w-12 text-white" />
          </div>
          
          {/* Loader principal */}
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          
          {/* Texto de carga */}
          <h2 className="text-xl font-semibold text-secondary-800 mb-2">Verificando autenticación</h2>
          <p className="text-secondary-600 mb-4">Por favor espera mientras verificamos tu sesión</p>
          
          {/* Indicador de estado */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>Verificando credenciales...</span>
          </div>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar los children
  return children;
};

export default PrivateRoute; 