import { useState, useEffect } from 'react';
import { getBarcodes, deleteBarcode } from '../services/barcodeService';
import { toast } from 'react-toastify';

const BarcodeTable = ({ barcodes = [], activeFilters = {} }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Debug: verificar que los props lleguen correctamente
  useEffect(() => {
    console.log('BarcodeTable props:', { barcodes, activeFilters });
    setLoading(false);
  }, [barcodes, activeFilters]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer.')) {
      try {
        setDeletingId(id);
        await deleteBarcode(id);
        toast.success('Registro eliminado con éxito');
        // Notificar al componente padre que se eliminó un registro
        // El Dashboard se encargará de actualizar los datos
        window.location.reload(); // Temporal: recargar para actualizar datos
      } catch (error) {
        console.error('Error al eliminar el registro:', error);
        toast.error('Error al eliminar el registro');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (barcodes.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron registros</h3>
        <p className="text-gray-500">
          {activeFilters && Object.keys(activeFilters).length > 0 
            ? 'No se encontraron registros con los filtros seleccionados. Intenta ajustar los criterios de búsqueda.'
            : 'No hay registros de escaneo disponibles en este momento.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Número de Guía</th>
            <th className="py-2 px-4 border-b text-left">Agencia</th>
            <th className="py-2 px-4 border-b text-left">Número de Serie</th>
            <th className="py-2 px-4 border-b text-left">Fecha de Escaneo</th>
            <th className="py-2 px-4 border-b text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {barcodes.map((barcode) => (
            <tr key={barcode._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{barcode.trackingNumber}</td>
              <td className="py-2 px-4 border-b">
                <span 
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    barcode.agency === 'MercadoLibre' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : barcode.agency === 'Servientrega' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {barcode.agency}
                </span>
              </td>
              <td className="py-2 px-4 border-b">{barcode.serialNumber}</td>
              <td className="py-2 px-4 border-b">
                {barcode.scannedAt 
                  ? new Date(barcode.scannedAt).toLocaleString()
                  : barcode.createdAt 
                    ? new Date(barcode.createdAt).toLocaleString()
                    : 'Fecha no disponible'
                }
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => handleDelete(barcode._id)}
                  disabled={deletingId === barcode._id}
                  className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  title="Eliminar registro"
                >
                  {deletingId === barcode._id ? (
                    <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BarcodeTable; 