import Navbar from '../components/Navbar';
import BarcodeScanner from '../components/BarcodeScanner';

const ScanPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Escaneo de Códigos de Barras</h1>
        
        <div className="mb-6">
          <p className="text-gray-600">
            Utilice este formulario para escanear y registrar nuevos códigos de barras. 
            El sistema identificará automáticamente la agencia según el número de dígitos de la guía.
          </p>
        </div>
        
        <BarcodeScanner />
      </div>
    </div>
  );
};

export default ScanPage; 