import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Package, 
  Truck, 
  Globe, 
  ChevronDown, 
  ChevronUp,
  X,
  RefreshCw
} from 'lucide-react';

const FilterForm = ({ onFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    agency: '',
    serialNumber: '',
    trackingNumber: '',
    date: '',
    startDate: '',
    endDate: '',
    status: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [dateType, setDateType] = useState('exact');
  const [activeFilters, setActiveFilters] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Búsqueda en tiempo real
    if (query.length >= 2) {
      const searchFilters = {
        ...filters,
        searchQuery: query
      };
      console.log('FilterForm: calling onFilter with searchQuery:', searchFilters);
      onFilter(searchFilters);
    } else if (query.length === 0) {
      // Cuando se limpia la búsqueda, remover searchQuery de los filtros
      const { searchQuery, ...filtersWithoutSearch } = filters;
      console.log('FilterForm: calling onFilter without searchQuery:', filtersWithoutSearch);
      onFilter(filtersWithoutSearch);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    
    // Actualizar filtros activos
    if (value) {
      if (!activeFilters.includes(name)) {
        setActiveFilters([...activeFilters, name]);
      }
    } else {
      setActiveFilters(activeFilters.filter(f => f !== name));
    }
  };

  const handleDateTypeChange = (type) => {
    setDateType(type);
    setFilters({
      ...filters,
      date: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const appliedFilters = {
      ...filters,
      searchQuery
    };
    
    // Aplicar filtros de fecha según el tipo seleccionado
    if (dateType === 'exact' && filters.date) {
      appliedFilters.date = filters.date;
    } else if (dateType === 'range') {
      if (filters.startDate) appliedFilters.startDate = filters.startDate;
      if (filters.endDate) appliedFilters.endDate = filters.endDate;
    }
    
    onFilter(appliedFilters);
  };

  const handleReset = () => {
    setFilters({
      agency: '',
      serialNumber: '',
      trackingNumber: '',
      date: '',
      startDate: '',
      endDate: '',
      status: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
    setSearchQuery('');
    setDateType('exact');
    setActiveFilters([]);
    onFilter({});
  };

  const removeFilter = (filterName) => {
    setFilters({ ...filters, [filterName]: '' });
    setActiveFilters(activeFilters.filter(f => f !== filterName));
    
    const updatedFilters = { ...filters, [filterName]: '' };
    onFilter(updatedFilters);
  };

  const getAgencyIcon = (agency) => {
    switch (agency) {
      case 'MercadoLibre':
        return <Package className="h-4 w-4" />;
      case 'Deprisa':
        return <Truck className="h-4 w-4" />;
      case 'Servientrega':
        return <Globe className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-6 overflow-hidden">
      {/* Barra de búsqueda principal */}
      <div className="p-6 border-b border-secondary-200/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar por número de guía, serial, agencia..."
            className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border-2 border-secondary-200 rounded-xl text-secondary-800 placeholder-secondary-400 transition-all duration-300 focus:border-primary-500 focus:bg-white focus:shadow-lg focus:shadow-primary-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-secondary-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-secondary-400" />
            </button>
          )}
        </div>
      </div>

      {/* Botón para mostrar/ocultar filtros avanzados */}
      <div className="p-4 bg-gradient-to-r from-secondary-50 to-primary-50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-secondary-200 rounded-xl text-secondary-700 hover:bg-white hover:border-primary-300 hover:text-primary-700 transition-all duration-300 group"
        >
          <Filter className="h-5 w-5 group-hover:text-primary-600" />
          <span className="font-semibold">Filtros Avanzados</span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 group-hover:text-primary-600" />
          ) : (
            <ChevronDown className="h-5 w-5 group-hover:text-primary-600" />
          )}
        </button>
      </div>

      {/* Filtros avanzados (colapsables) */}
      {isExpanded && (
        <div className="p-6 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Filtros principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Agencia */}
              <div className="space-y-2">
                <label className="block text-secondary-700 text-sm font-semibold">
                  Agencia de Envío
                </label>
                <div className="relative">
                  <select
                    name="agency"
                    value={filters.agency}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-secondary-200 rounded-xl text-secondary-800 focus:border-primary-500 focus:bg-white focus:shadow-lg focus:shadow-primary-500/20 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="">Todas las agencias</option>
                    <option value="MercadoLibre">MercadoLibre</option>
                    <option value="Deprisa">Deprisa</option>
                    <option value="Servientrega">Servientrega</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {filters.agency ? (
                      <div className="text-primary-600">
                        {getAgencyIcon(filters.agency)}
                      </div>
                    ) : (
                      <Package className="h-5 w-5 text-secondary-400" />
                    )}
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-secondary-400" />
                  </div>
                </div>
              </div>

              {/* Número de Serie */}
              <div className="space-y-2">
                <label className="block text-secondary-700 text-sm font-semibold">
                  Número de Serie
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={filters.serialNumber}
                  onChange={handleChange}
                  placeholder="Filtrar por serial"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-secondary-200 rounded-xl text-secondary-800 placeholder-secondary-400 focus:border-primary-500 focus:bg-white focus:shadow-lg focus:shadow-primary-500/20 transition-all duration-300"
                />
              </div>

              {/* Número de Guía */}
              <div className="space-y-2">
                <label className="block text-secondary-700 text-sm font-semibold">
                  Número de Guía
                </label>
                <input
                  type="text"
                  name="trackingNumber"
                  value={filters.trackingNumber}
                  onChange={handleChange}
                  placeholder="Filtrar por guía"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-secondary-200 rounded-xl text-secondary-800 placeholder-secondary-400 focus:border-primary-500 focus:bg-white focus:shadow-lg focus:shadow-primary-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Filtros de fecha */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-secondary-600" />
                <h4 className="text-lg font-semibold text-secondary-800">Filtros de Fecha</h4>
              </div>
              
              <div className="flex space-x-6 mb-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="dateType"
                    checked={dateType === 'exact'}
                    onChange={() => handleDateTypeChange('exact')}
                    className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-secondary-700 font-medium">Fecha Específica</span>
                </label>
                
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="dateType"
                    checked={dateType === 'range'}
                    onChange={() => handleDateTypeChange('range')}
                    className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-secondary-700 font-medium">Rango de Fechas</span>
                </label>
              </div>
              
              {dateType === 'exact' ? (
                <div>
                  <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-secondary-200 rounded-xl text-secondary-800 focus:border-primary-500 focus:bg-white focus:shadow-lg focus:shadow-primary-500/20 transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-secondary-600 text-sm mb-2 font-medium">Desde</label>
                    <input
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-secondary-200 rounded-xl text-secondary-800 focus:border-primary-500 focus:bg-white focus:shadow-lg focus:shadow-primary-500/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-600 text-sm mb-2 font-medium">Hasta</label>
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-secondary-200 rounded-xl text-secondary-800 focus:border-primary-500 focus:bg-white focus:shadow-lg focus:shadow-primary-500/20 transition-all duration-300"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Ordenamiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-secondary-700 text-sm font-semibold">
                  Ordenar por
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-secondary-200 rounded-xl text-secondary-800 focus:border-primary-500 focus:bg-white focus:shadow-lg focus:shadow-primary-500/20 transition-all duration-300 cursor-pointer"
                >
                  <option value="date">Fecha de Registro</option>
                  <option value="trackingNumber">Número de Guía</option>
                  <option value="serialNumber">Número de Serie</option>
                  <option value="agency">Agencia</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-secondary-700 text-sm font-semibold">
                  Orden
                </label>
                <select
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-secondary-200 rounded-xl text-secondary-800 focus:border-primary-500 focus:bg-white focus:shadow-lg focus:shadow-primary-500/20 transition-all duration-300 cursor-pointer"
                >
                  <option value="desc">Más Reciente</option>
                  <option value="asc">Más Antiguo</option>
                </select>
              </div>
            </div>

            {/* Filtros activos */}
            {activeFilters.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-secondary-700">Filtros Activos:</h4>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => {
                    const value = filters[filter];
                    if (!value) return null;
                    
                    return (
                      <div
                        key={filter}
                        className="inline-flex items-center space-x-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium"
                      >
                        <span>{filter === 'agency' ? 'Agencia' : 
                               filter === 'serialNumber' ? 'Serial' : 
                               filter === 'trackingNumber' ? 'Guía' : 
                               filter === 'date' ? 'Fecha' : 
                               filter === 'startDate' ? 'Desde' : 
                               filter === 'endDate' ? 'Hasta' : filter}: {value}</span>
                        <button
                          onClick={() => removeFilter(filter)}
                          className="ml-1 hover:bg-primary-200 rounded-full p-1 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-secondary-200/50">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-secondary-100 text-secondary-700 rounded-xl hover:bg-secondary-200 hover:text-secondary-800 transition-all duration-300 font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Limpiar Filtros</span>
              </button>
              <button
                type="submit"
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 font-medium transform hover:scale-105"
              >
                <Filter className="h-4 w-4" />
                <span>Aplicar Filtros</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FilterForm; 