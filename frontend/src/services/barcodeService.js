import api from './api';

// Crear un nuevo registro de código de barras
export const createBarcode = async (trackingNumber, serialNumber) => {
  const response = await api.post('/barcodes', { trackingNumber, serialNumber });
  return response.data;
};

// Obtener todos los registros con filtros opcionales
export const getBarcodes = async (filters = {}) => {
  const response = await api.get('/barcodes', { params: filters });
  return response.data;
};

// Obtener un registro específico por ID
export const getBarcodeById = async (id) => {
  const response = await api.get(`/barcodes/${id}`);
  return response.data;
};

// Eliminar un registro por ID
export const deleteBarcode = async (id) => {
  const response = await api.delete(`/barcodes/${id}`);
  return response.data;
};

// Determinar agencia basada en el número de guía
export const determineAgency = (trackingNumber) => {
  const cleanNumber = trackingNumber.replace(/\D/g, '');
  
  if (cleanNumber.length === 11) {
    return 'MercadoLibre';
  } else if (cleanNumber.length === 12) {
    return 'Deprisa';
  }
  
  return 'Desconocida';
}; 