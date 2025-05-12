import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createBarcode, determineAgency } from '../services/barcodeService';

const BarcodeScanner = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [agency, setAgency] = useState('');
  const [step, setStep] = useState(1); // 1 = Escanear guía, 2 = Escanear serial, 3 = Confirmar
  const [loading, setLoading] = useState(false);
  const [scannedAt, setScannedAt] = useState(new Date());
  const [stepTransition, setStepTransition] = useState(false);
  const [scanAnimation, setScanAnimation] = useState(false);

  const trackingInputRef = useRef(null);
  const serialInputRef = useRef(null);

  // Actualizar fecha y hora actual
  useEffect(() => {
    const timer = setInterval(() => {
      setScannedAt(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Efecto para las transiciones de pasos
  useEffect(() => {
    setStepTransition(true);
    const timer = setTimeout(() => {
      setStepTransition(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [step]);

  // Autofoco en el input correspondiente según el paso
  useEffect(() => {
    if (step === 1 && trackingInputRef.current) {
      trackingInputRef.current.focus();
    } else if (step === 2 && serialInputRef.current) {
      serialInputRef.current.focus();
    }
  }, [step]);

  // Efecto para la animación de escaneo
  useEffect(() => {
    if (trackingNumber || serialNumber) {
      setScanAnimation(true);
      const timer = setTimeout(() => {
        setScanAnimation(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [trackingNumber, serialNumber]);

  // Manejar cambio en número de guía
  const handleTrackingChange = (e) => {
    const value = e.target.value;
    setTrackingNumber(value);
    
    // Determinar la agencia basada en el número de guía
    if (value) {
      const detectedAgency = determineAgency(value);
      setAgency(detectedAgency);
    } else {
      setAgency('');
    }
  };

  // Manejar cuando se presiona Enter en el campo de guía
  const handleTrackingKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Validar número de guía
      const cleanNumber = trackingNumber.replace(/\D/g, '');
      if (cleanNumber.length !== 11 && cleanNumber.length !== 12) {
        toast.error('El número de guía debe tener 11 dígitos (MercadoLibre) o 12 dígitos (Deprisa)');
        return;
      }
      
      setStep(2);
    }
  };

  // Manejar cuando se presiona Enter en el campo de serial
  const handleSerialKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Validar serial
      if (!serialNumber.trim()) {
        toast.error('Debe proporcionar un número de serie válido');
        return;
      }
      
      setStep(3);
    }
  };

  // Confirmar y guardar el registro
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await createBarcode(trackingNumber, serialNumber);
      toast.success('Registro guardado con éxito');
      
      // Reiniciar formulario
      setTrackingNumber('');
      setSerialNumber('');
      setAgency('');
      setStep(1);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al guardar el registro';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cancelar y reiniciar
  const handleCancel = () => {
    setTrackingNumber('');
    setSerialNumber('');
    setAgency('');
    setStep(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto transform transition-all duration-300 hover:shadow-md">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center p-2 mb-2 rounded-full bg-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m0 0v7m0-7h-2m2 0v-7m0 7h2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Escaneo de Códigos
        </h2>
        <p className="text-gray-500 mt-1">Siga los pasos para registrar un nuevo código</p>
      </div>
      
      {/* Indicador de pasos */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-300'}`}>
            1
          </div>
          <div className={`h-1 w-12 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-300`}></div>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-300'}`}>
            2
          </div>
          <div className={`h-1 w-12 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-300`}></div>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-300'}`}>
            3
          </div>
        </div>
      </div>
      
      <div className="overflow-hidden h-auto relative">
        {/* Paso 1: Escanear Guía */}
        <div className={`transition-all duration-500 ease-in-out transform ${step === 1 ? 'translate-x-0 opacity-100' : 'absolute translate-x-full opacity-0'}`}>
          <div className={`mb-6 ${stepTransition && step === 1 ? 'animate-fadeIn' : ''}`}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Escanee el Número de Guía</h3>
              <p className="text-sm text-gray-500">El sistema detectará automáticamente la agencia</p>
            </div>
            
            <div className="relative">
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-30 ${scanAnimation ? 'animate-pulse' : ''}`}></div>
              <div className="relative bg-white rounded-lg">
                <div className="flex">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <input
                    ref={trackingInputRef}
                    type="text"
                    value={trackingNumber}
                    onChange={handleTrackingChange}
                    onKeyDown={handleTrackingKeyDown}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Escanee o ingrese el número de guía"
                    autoFocus
                  />
                </div>
              </div>
            </div>
            
            {agency && (
              <div className="mt-3 animate-fadeIn">
                <div className="flex items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-sm text-gray-600">Agencia detectada:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${agency === 'MercadoLibre' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{agency}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleTrackingKeyDown({ key: 'Enter', preventDefault: () => {} })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                disabled={!trackingNumber}
              >
                <span>Continuar</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Paso 2: Escanear Serial */}
        <div className={`transition-all duration-500 ease-in-out transform ${step === 2 ? 'translate-x-0 opacity-100' : step < 2 ? 'absolute translate-x-full opacity-0' : 'absolute -translate-x-full opacity-0'}`}>
          <div className={`mb-6 ${stepTransition && step === 2 ? 'animate-fadeIn' : ''}`}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Escanee el Número de Serie</h3>
              <p className="text-sm text-gray-500">Escanee o ingrese el número de serie del producto</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium text-gray-500 w-32">Número de Guía:</span>
                <span className="font-semibold text-gray-800">{trackingNumber}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 w-32">Agencia:</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${agency === 'MercadoLibre' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{agency}</span>
              </div>
            </div>
            
            <div className="relative">
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-30 ${scanAnimation ? 'animate-pulse' : ''}`}></div>
              <div className="relative bg-white rounded-lg">
                <div className="flex">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <input
                    ref={serialInputRef}
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    onKeyDown={handleSerialKeyDown}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Escanee o ingrese el número de serie"
                    autoFocus
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                <span>Atrás</span>
              </button>
              <button
                onClick={() => handleSerialKeyDown({ key: 'Enter', preventDefault: () => {} })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                disabled={!serialNumber}
              >
                <span>Continuar</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Paso 3: Confirmar */}
        <div className={`transition-all duration-500 ease-in-out transform ${step === 3 ? 'translate-x-0 opacity-100' : 'absolute -translate-x-full opacity-0'}`}>
          <div className={`mb-6 ${stepTransition && step === 3 ? 'animate-fadeIn' : ''}`}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Confirmar Información</h3>
              <p className="text-sm text-gray-500">Verifique los detalles antes de guardar</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 mb-4">
              <h4 className="text-md font-semibold text-blue-800 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resumen del Escaneo
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center border-b border-blue-200 pb-2">
                  <span className="font-medium text-gray-700 w-36">Número de Guía:</span>
                  <span className="font-semibold text-gray-900">{trackingNumber}</span>
                </div>
                <div className="flex items-center border-b border-blue-200 pb-2">
                  <span className="font-medium text-gray-700 w-36">Agencia:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${agency === 'MercadoLibre' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{agency}</span>
                </div>
                <div className="flex items-center border-b border-blue-200 pb-2">
                  <span className="font-medium text-gray-700 w-36">Número de Serie:</span>
                  <span className="font-semibold text-gray-900">{serialNumber}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Fecha y Hora:</span>
                  <span className="font-semibold text-gray-900">{scannedAt.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                <span>Atrás</span>
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Confirmar y Guardar</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner; 