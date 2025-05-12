import { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser, isAuthenticated } from '../services/authService';

// Crear contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario al montar el componente
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (isAuthenticated()) {
          const { data } = await getCurrentUser();
          setUser(data);
        }
      } catch (err) {
        console.error('Error cargando usuario:', err);
        // Si hay un error, limpiar token
        apiLogout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función de login
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiLogin(username, password);
      const { data } = await getCurrentUser();
      setUser(data);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al iniciar sesión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    apiLogout();
    setUser(null);
  };

  // Valores del contexto
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
}; 