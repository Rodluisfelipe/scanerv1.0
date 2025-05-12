import api from './api';

// Login
export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
};

// Obtener usuario actual
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Cambiar contraseña
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/change-password', {
    currentPassword,
    newPassword
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Verificar si está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
}; 