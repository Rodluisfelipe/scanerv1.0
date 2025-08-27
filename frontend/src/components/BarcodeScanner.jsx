import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createBarcode, determineAgency } from '../services/barcodeService';
import { 
  Package, 
  Scan, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Truck, 
  ShoppingCart, 
  Globe,
  Zap,
  Clock,
  AlertCircle,
  Sparkles,
  Target,
  BarChart3,
  FileText,
  QrCode
} from 'lucide-react';

const BarcodeScanner = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [agency, setAgency] = useState('');
  const [step, setStep] = useState(1); // 1 = Escanear guía, 2 = Escanear serial, 3 = Confirmar
  const [loading, setLoading] = useState(false);
  const [scannedAt, setScannedAt] = useState(new Date());
  const [stepTransition, setStepTransition] = useState(false);
  const [scanAnimation, setScanAnimation] = useState(false);
  const [particles, setParticles] = useState([]);

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

  // Efecto para partículas flotantes
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.2 + 0.1,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y - p.speed,
        x: p.x + (Math.random() - 0.5) * 0.3,
      })));
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
      if (cleanNumber.length !== 11 && cleanNumber.length !== 12 && cleanNumber.length !== 10) {
        toast.error('El número de guía debe tener 11 dígitos (MercadoLibre), 12 dígitos (Deprisa) o 10 dígitos (Servientrega)');
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

  const getAgencyIcon = (agencyName) => {
    switch (agencyName) {
      case 'MercadoLibre':
        return <ShoppingCart className="h-5 w-5" />;
      case 'Deprisa':
        return <Truck className="h-5 w-5" />;
      case 'Servientrega':
        return <Globe className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getAgencyColor = (agencyName) => {
    switch (agencyName) {
      case 'MercadoLibre':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'Deprisa':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'Servientrega':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-secondary-100 text-secondary-800 border-secondary-200';
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Partículas flotantes */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-primary-400/30 rounded-full animate-float pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDelay: `${particle.id * 0.1}s`,
          }}
        />
      ))}

      <div className="card-glass p-8 max-w-4xl mx-auto transform transition-all duration-500 hover:scale-[1.02]">
        
        {/* Header del scanner */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center p-4 mb-4 rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-2xl group-hover:shadow-primary-500/50 transition-all duration-500 group-hover:scale-110">
            <QrCode className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700 bg-clip-text text-transparent mb-2">
            Escaneo Inteligente
          </h2>
          <p className="text-secondary-600 text-lg">Sistema avanzado de registro de códigos</p>
        </div>
        
        {/* Indicador de pasos mejorado */}
        <div className="flex justify-center mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  step >= stepNumber 
                    ? 'border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-500/50' 
                    : 'border-secondary-300 text-secondary-300'
                }`}>
                  {step > stepNumber ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="text-lg font-semibold">{stepNumber}</span>
                  )}
                  
                  {/* Indicador de progreso */}
                  {step === stepNumber && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                {stepNumber < 3 && (
                  <div className={`h-1 w-16 transition-all duration-500 ${
                    step > stepNumber ? 'bg-primary-600' : 'bg-secondary-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Contenido de los pasos */}
        <div className="overflow-hidden h-auto relative">
          
          {/* Paso 1: Escanear Guía */}
          <div className={`transition-all duration-700 ease-in-out transform ${
            step === 1 ? 'translate-x-0 opacity-100' : 'absolute translate-x-full opacity-0'
          }`}>
            <div className={`mb-6 ${stepTransition && step === 1 ? 'animate-fade-in-up' : ''}`}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-3 mb-3 rounded-2xl bg-primary-100">
                  <FileText className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-800 mb-2">Escanee el Número de Guía</h3>
                <p className="text-secondary-600">El sistema detectará automáticamente la agencia de envío</p>
              </div>
              
              <div className="relative group">
                <div className={`absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur opacity-30 transition-all duration-500 ${
                  scanAnimation ? 'animate-pulse scale-105' : 'group-hover:opacity-50'
                }`}></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
                  <div className="flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Package className="h-6 w-6 text-secondary-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                    </div>
                    <input
                      ref={trackingInputRef}
                      type="text"
                      value={trackingNumber}
                      onChange={handleTrackingChange}
                      onKeyDown={handleTrackingKeyDown}
                      className="w-full pl-14 pr-4 py-4 text-lg bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-secondary-400"
                      placeholder="Escanee o ingrese el número de guía"
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Información de agencia detectada */}
              {agency && (
                <div className="mt-6 animate-fade-in-up">
                  <div className={`inline-flex items-center space-x-3 px-4 py-3 rounded-2xl border ${getAgencyColor(agency)}`}>
                    {getAgencyIcon(agency)}
                    <div>
                      <span className="text-sm font-medium">Agencia detectada:</span>
                      <span className="ml-2 px-3 py-1 rounded-full text-sm font-semibold bg-white/50">
                        {agency}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Botón de continuar */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => handleTrackingKeyDown({ key: 'Enter', preventDefault: () => {} })}
                  className="btn-primary flex items-center space-x-2 px-6 py-3"
                  disabled={!trackingNumber}
                >
                  <span>Continuar</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Paso 2: Escanear Serial */}
          <div className={`transition-all duration-700 ease-in-out transform ${
            step === 2 ? 'translate-x-0 opacity-100' : step < 2 ? 'absolute translate-x-full opacity-0' : 'absolute -translate-x-full opacity-0'
          }`}>
            <div className={`mb-6 ${stepTransition && step === 2 ? 'animate-fade-in-up' : ''}`}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-3 mb-3 rounded-2xl bg-success-100">
                  <Scan className="h-8 w-8 text-success-600" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-800 mb-2">Escanee el Número de Serie</h3>
                <p className="text-secondary-600">Capture el serial del producto para completar el registro</p>
              </div>
              
              {/* Resumen del paso anterior */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-2xl border border-primary-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Package className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-500">Número de Guía</p>
                      <p className="font-semibold text-secondary-800">{trackingNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-secondary-100 rounded-lg">
                      {getAgencyIcon(agency)}
                    </div>
                    <div>
                      <p className="text-sm text-secondary-500">Agencia</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getAgencyColor(agency)}`}>
                        {agency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Campo de serial */}
              <div className="relative group">
                <div className={`absolute -inset-1 bg-gradient-to-r from-success-500 to-success-600 rounded-2xl blur opacity-30 transition-all duration-500 ${
                  scanAnimation ? 'animate-pulse scale-105' : 'group-hover:opacity-50'
                }`}></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
                  <div className="flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Target className="h-6 w-6 text-secondary-400 group-focus-within:text-success-500 transition-colors duration-300" />
                    </div>
                    <input
                      ref={serialInputRef}
                      type="text"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      onKeyDown={handleSerialKeyDown}
                      className="w-full pl-14 pr-4 py-4 text-lg bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-secondary-400"
                      placeholder="Escanee o ingrese el número de serie"
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botones de navegación */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="btn-outline flex items-center space-x-2 px-6 py-3"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Atrás</span>
                </button>
                <button
                  onClick={() => handleSerialKeyDown({ key: 'Enter', preventDefault: () => {} })}
                  className="btn-primary flex items-center space-x-2 px-6 py-3"
                  disabled={!serialNumber}
                >
                  <span>Continuar</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Paso 3: Confirmar */}
          <div className={`transition-all duration-700 ease-in-out transform ${
            step === 3 ? 'translate-x-0 opacity-100' : 'absolute -translate-x-full opacity-0'
          }`}>
            <div className={`mb-6 ${stepTransition && step === 3 ? 'animate-fade-in-up' : ''}`}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-3 mb-3 rounded-2xl bg-warning-100">
                  <CheckCircle className="h-8 w-8 text-warning-600" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-800 mb-2">Confirmar Información</h3>
                <p className="text-secondary-600">Verifique todos los detalles antes de guardar</p>
              </div>
              
              {/* Resumen completo */}
              <div className="bg-gradient-to-r from-warning-50 to-orange-50 p-8 rounded-2xl border border-warning-200 mb-6">
                <h4 className="text-xl font-semibold text-warning-800 mb-6 flex items-center justify-center space-x-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Resumen del Escaneo</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                      <span className="font-medium text-secondary-700">Número de Guía:</span>
                      <span className="font-semibold text-secondary-900">{trackingNumber}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                      <span className="font-medium text-secondary-700">Agencia:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getAgencyColor(agency)}`}>
                        {agency}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                      <span className="font-medium text-secondary-700">Número de Serie:</span>
                      <span className="font-semibold text-secondary-900">{serialNumber}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                      <span className="font-medium text-secondary-700">Fecha y Hora:</span>
                      <span className="font-semibold text-secondary-900">{scannedAt.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="btn-outline flex items-center space-x-2 px-6 py-3"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Atrás</span>
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-secondary-100 text-secondary-700 rounded-xl hover:bg-secondary-200 transition-all duration-300 flex items-center space-x-2"
                    disabled={loading}
                  >
                    <X className="h-5 w-5" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="btn-success flex items-center space-x-2 px-6 py-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="loader-dots">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Confirmar y Guardar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer del scanner */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm">
            <Zap className="h-4 w-4" />
            <span>Escaneo optimizado para máxima precisión</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner; 