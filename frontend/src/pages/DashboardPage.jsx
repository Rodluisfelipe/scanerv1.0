import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FilterForm from '../components/FilterForm';
import BarcodeTable from '../components/BarcodeTable';
import { getBarcodes } from '../services/barcodeService';

const DashboardPage = () => {
  const [activeFilters, setActiveFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    mercadoLibre: 0,
    deprisa: 0,
    lastDay: 0
  });
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    // Animación de entrada
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
    
    // Cargar estadísticas iniciales
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      setLoading(true);
      const result = await getBarcodes();
      const records = result.data || [];
      
      // Calcular estadísticas
      const lastDayDate = new Date();
      lastDayDate.setDate(lastDayDate.getDate() - 1);
      
      const mercadoLibreCount = records.filter(item => item.agency === 'MercadoLibre').length;
      const deprisaCount = records.filter(item => item.agency === 'Deprisa').length;
      const lastDayCount = records.filter(item => new Date(item.scannedAt) > lastDayDate).length;
      
      setStats({
        total: records.length,
        mercadoLibre: mercadoLibreCount,
        deprisa: deprisaCount,
        lastDay: lastDayCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    setActiveFilters(filters);
    // No es necesario actualizar las estadísticas después de filtrar
  };

  // Clases de animación de entrada
  const fadeInClass = fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className={`transition-all duration-700 ease-out ${fadeInClass}`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Panel de Control</h1>
            <div className="text-sm text-gray-500">
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-transform duration-300 hover:shadow-md hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Registros</p>
                  <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-transform duration-300 hover:shadow-md hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">MercadoLibre</p>
                  <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.mercadoLibre}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${loading ? 0 : (stats.mercadoLibre / (stats.total || 1) * 100)}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-transform duration-300 hover:shadow-md hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Deprisa</p>
                  <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.deprisa}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${loading ? 0 : (stats.deprisa / (stats.total || 1) * 100)}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-transform duration-300 hover:shadow-md hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Últimas 24h</p>
                  <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.lastDay}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${loading ? 0 : (stats.lastDay / (stats.total || 1) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filtros */}
          <div className="mb-6">
            <details className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <summary className="p-4 font-medium text-gray-700 cursor-pointer flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros de Búsqueda
              </summary>
              <div className="p-4 border-t border-gray-100">
                <FilterForm onFilter={handleFilter} />
              </div>
            </details>
          </div>
          
          {/* Tabla */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Registros de Escaneo</h2>
              <div className="text-sm text-gray-500">
                {!loading && <span>Mostrando {stats.total} registros</span>}
              </div>
            </div>
            
            <BarcodeTable filters={activeFilters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 