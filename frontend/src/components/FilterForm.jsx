import { useState } from 'react';

const FilterForm = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    agency: '',
    serialNumber: '',
    date: '',
    startDate: '',
    endDate: ''
  });
  const [dateType, setDateType] = useState('exact'); // 'exact' o 'range'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleDateTypeChange = (type) => {
    setDateType(type);
    // Resetear los campos de fecha al cambiar el tipo
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
      agency: filters.agency,
      serialNumber: filters.serialNumber
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
      date: '',
      startDate: '',
      endDate: ''
    });
    setDateType('exact');
    onFilter({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Filtros</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Agencia
            </label>
            <select
              name="agency"
              value={filters.agency}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              <option value="MercadoLibre">MercadoLibre</option>
              <option value="Deprisa">Deprisa</option>
              <option value="Servientrega">Servientrega</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Número de Serie
            </label>
            <input
              type="text"
              name="serialNumber"
              value={filters.serialNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filtrar por número de serie"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Filtro de Fecha
          </label>
          
          <div className="flex space-x-4 mb-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="dateType"
                checked={dateType === 'exact'}
                onChange={() => handleDateTypeChange('exact')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Fecha Exacta</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="dateType"
                checked={dateType === 'range'}
                onChange={() => handleDateTypeChange('range')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Rango de Fechas</span>
            </label>
          </div>
          
          {dateType === 'exact' ? (
            <div>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1">Desde</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">Hasta</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Limpiar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Aplicar Filtros
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterForm; 