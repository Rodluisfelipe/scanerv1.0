import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FilterForm from '../components/FilterForm';
import BarcodeTable from '../components/BarcodeTable';
import { getBarcodes } from '../services/barcodeService';
import { 
  BarChart3, 
  Package, 
  TrendingUp, 
  Clock, 
  Activity, 
  Users, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Globe,
  Truck,
  ShoppingCart,
  Calendar,
  Filter,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const DashboardPage = () => {
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredBarcodes, setFilteredBarcodes] = useState([]);
  const [allBarcodes, setAllBarcodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    mercadoLibre: 0,
    deprisa: 0,
    servientrega: 0,
    lastDay: 0,
    lastWeek: 0,
    lastMonth: 0
  });
  const [fadeIn, setFadeIn] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
        
        // Guardar todos los barcodes para filtrado local
        setAllBarcodes(records);
        setFilteredBarcodes(records);
        
        // Calcular estadísticas
        const now = new Date();
        const lastDayDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const lastWeekDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastMonthDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const mercadoLibreCount = records.filter(item => item.agency === 'MercadoLibre').length;
        const deprisaCount = records.filter(item => item.agency === 'Deprisa').length;
        const servientregaCount = records.filter(item => item.agency === 'Servientrega').length;
        const lastDayCount = records.filter(item => new Date(item.scannedAt) > lastDayDate).length;
        const lastWeekCount = records.filter(item => new Date(item.scannedAt) > lastWeekDate).length;
        const lastMonthCount = records.filter(item => new Date(item.scannedAt) > lastMonthDate).length;
        
        setStats({
          total: records.length,
          mercadoLibre: mercadoLibreCount,
          deprisa: deprisaCount,
          servientrega: servientregaCount,
          lastDay: lastDayCount,
          lastWeek: lastWeekCount,
          lastMonth: lastMonthCount
        });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStats();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleFilter = (filters) => {
    console.log('handleFilter called with:', filters);
    setActiveFilters(filters);
    
    // Aplicar filtros localmente
    let filtered = [...allBarcodes];
    
    // Búsqueda por texto (searchQuery)
    if (filters.searchQuery && filters.searchQuery.length >= 2) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.trackingNumber && item.trackingNumber.toLowerCase().includes(query)) ||
        (item.serialNumber && item.serialNumber.toLowerCase().includes(query)) ||
        (item.agency && item.agency.toLowerCase().includes(query))
      );
    }
    
    // Filtro por agencia
    if (filters.agency) {
      filtered = filtered.filter(item => item.agency === filters.agency);
    }
    
    // Filtro por número de serie
    if (filters.serialNumber) {
      filtered = filtered.filter(item => 
        item.serialNumber && item.serialNumber.toLowerCase().includes(filters.serialNumber.toLowerCase())
      );
    }
    
    // Filtro por número de guía
    if (filters.trackingNumber) {
      filtered = filtered.filter(item => 
        item.trackingNumber && item.trackingNumber.toLowerCase().includes(filters.trackingNumber.toLowerCase())
      );
    }
    
    // Filtros de fecha
    if (filters.date) {
      const filterDate = new Date(filters.date).toDateString();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.scannedAt || item.createdAt).toDateString();
        return itemDate === filterDate;
      });
    }
    
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.scannedAt || item.createdAt);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    // Ordenamiento
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (filters.sortBy) {
          case 'trackingNumber':
            aValue = a.trackingNumber || '';
            bValue = b.trackingNumber || '';
            break;
          case 'serialNumber':
            aValue = a.serialNumber || '';
            bValue = b.serialNumber || '';
            break;
          case 'agency':
            aValue = a.agency || '';
            bValue = b.agency || '';
            break;
          case 'date':
          default:
            aValue = new Date(a.scannedAt || a.createdAt);
            bValue = new Date(b.scannedAt || b.createdAt);
            break;
        }
        
        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    
    setFilteredBarcodes(filtered);
  };

  // Clases de animación de entrada
  const fadeInClass = fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  const statCards = [
    {
      title: 'Total Registros',
      value: stats.total,
      icon: Package,
      color: 'primary',
      gradient: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      trend: '+12%',
      trendDirection: 'up',
      description: 'Registros totales en el sistema',
      isAgency: false
    },
    {
      title: 'MercadoLibre',
      value: stats.mercadoLibre,
      icon: ShoppingCart,
      logo: 'https://http2.mlstatic.com/storage/pog-cm-admin/calm-assets/mercado-libre-thumbnail--1538x1510--9a90a4e7.webp',
      color: 'warning',
      gradient: 'from-warning-500 to-warning-600',
      bgColor: 'bg-warning-50',
      iconColor: 'text-warning-600',
      trend: '+8%',
      trendDirection: 'up',
      description: 'Envíos de MercadoLibre',
      isAgency: true
    },
    {
      title: 'Deprisa',
      value: stats.deprisa,
      icon: Truck,
      logo: 'https://cosmocentro.com/wp-content/uploads/2016/07/depri.jpg',
      color: 'success',
      gradient: 'from-success-500 to-success-600',
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600',
      trend: '+15%',
      trendDirection: 'up',
      description: 'Envíos de Deprisa',
      isAgency: true
    },
    {
      title: 'Servientrega',
      value: stats.servientrega,
      icon: Globe,
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_LRWstBnJD1YtFVZLIyLrjT0QagTQQ6YeCg&s',
      color: 'info',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+5%',
      trendDirection: 'up',
      description: 'Envíos de Servientrega',
      isAgency: true
    },
    {
      title: 'Últimas 24h',
      value: stats.lastDay,
      icon: Clock,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: '+22%',
      trendDirection: 'up',
      description: 'Registros del último día',
      isAgency: false
    },
    {
      title: 'Esta Semana',
      value: stats.lastWeek,
      icon: Calendar,
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      trend: '+18%',
      trendDirection: 'up',
      description: 'Registros de esta semana',
      isAgency: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-100">
      <Navbar />
      
      <div className="pt-20 container mx-auto px-4 py-8">
        <div className={`transition-all duration-1000 ease-out ${fadeInClass}`}>
          
          {/* Header del Dashboard */}
          <div className="mb-8 animate-fade-in-down">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700 bg-clip-text text-transparent mb-2">
                  Panel de Control
                </h1>
                <p className="text-secondary-600 text-lg">
                  Monitorea y gestiona todos tus registros de escaneo
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-secondary-500">Última actualización</p>
                  <p className="text-sm font-medium text-secondary-700">
                    {new Date().toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-5 w-5 text-primary-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="group relative overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-modern p-6 hover:scale-105 transition-all duration-500 relative">
                    {/* Logo de fondo con blur para agencias */}
                    {card.isAgency && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <img 
                          src={card.logo} 
                          alt={card.title} 
                          className="w-full h-full object-cover blur-sm"
                        />
                      </div>
                    )}
                    
                    {/* Contenido de la tarjeta con z-index para estar por encima del logo */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-6 w-6 ${card.iconColor}`} />
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            {card.trendDirection === 'up' ? (
                              <ArrowUpRight className="h-4 w-4 text-success-500" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-error-500" />
                            )}
                            <span className={`text-xs font-medium ${
                              card.trendDirection === 'up' ? 'text-success-600' : 'text-error-600'
                            }`}>
                              {card.trend}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-2 text-center">
                        <div className="text-2xl font-bold text-secondary-800">
                          {loading ? (
                            <div className="h-8 bg-secondary-200 rounded animate-pulse mx-auto w-16"></div>
                          ) : (
                            card.value.toLocaleString()
                          )}
                        </div>
                        <div className="text-sm font-medium text-secondary-600">{card.title}</div>
                      </div>
                      
                      <div className="text-xs text-secondary-500 text-center">
                        {card.description}
                      </div>
                      
                      {/* Barra de progreso */}
                      <div className="mt-4">
                        <div className="w-full bg-secondary-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${card.gradient} transition-all duration-1000 ease-out`}
                            style={{ 
                              width: loading ? '0%' : `${Math.min((card.value / (stats.total || 1)) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              );
            })}
          </div>
          
          {/* Sección de filtros */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <FilterForm onFilter={handleFilter} />
          </div>
          
          {/* Tabla de registros */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="card-glass p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-secondary-800">Registros de Escaneo</h2>
                                         <p className="text-sm text-secondary-600">
                       {!loading && (
                         <span>
                           Mostrando {filteredBarcodes.length} de {stats.total} registros
                           {filteredBarcodes.length !== stats.total && ' (filtrados)'}
                         </span>
                       )}
                     </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-3 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">
                    <Activity className="h-3 w-3" />
                    <span>En tiempo real</span>
                  </div>
                </div>
              </div>
              
                             <BarcodeTable barcodes={filteredBarcodes} activeFilters={activeFilters} />
            </div>
          </div>
          
          {/* Footer del Dashboard */}
          <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/20">
              <Sparkles className="h-4 w-4 text-primary-500" />
              <span className="text-sm text-secondary-600">
                Sistema optimizado para máxima eficiencia
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con crédito del desarrollador */}
      <div className="mt-12 pb-8 text-center">
        <div className="text-sm text-secondary-500 space-y-2">
          <p>© {new Date().getFullYear()} Scaner Tecnophone. Todos los derechos reservados.</p>
          
          {/* Crédito del desarrollador */}
          <div className="flex items-center justify-center space-x-3">
            <span className="text-xs text-secondary-400">Desarrollado por</span>
            <a 
              href="https://github.com/Rodluisfelipe" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-3 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg transition-all duration-300 hover:scale-105 group"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-medium group-hover:text-secondary-900">Felipe Rodriguez</span>
            </a>
            
            <a 
              href="https://www.instagram.com/stack_ia?igsh=bm1tYnJ5MG9lc2dl&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all duration-300 hover:scale-105 group"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="font-medium group-hover:text-green-900">StackIA</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 