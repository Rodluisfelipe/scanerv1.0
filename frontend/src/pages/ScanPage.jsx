import Navbar from '../components/Navbar';
import BarcodeScanner from '../components/BarcodeScanner';


const ScanPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-100">
      <Navbar />
      
      <div className="pt-20 container mx-auto px-4 py-8">
        {/* Componente del scanner */}
        <div className="animate-fade-in-up">
          <BarcodeScanner />
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
              <span className="font-medium group-hover:text-green-700">StackIA</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanPage; 