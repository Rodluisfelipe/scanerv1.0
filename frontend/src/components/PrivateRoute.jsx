import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Si está cargando, mostrar indicador de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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