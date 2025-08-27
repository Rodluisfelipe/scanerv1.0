import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  Eye, 
  EyeOff, 
  User, 
  Lock, 
  Sparkles, 
  Shield, 
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [particles, setParticles] = useState([]);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Efecto para la animación inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Efecto para partículas flotantes
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.3 + 0.1,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y - p.speed,
        x: p.x + (Math.random() - 0.5) * 0.5,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!username || !password) {
      setLoginError('Por favor ingrese usuario y contraseña');
      return;
    }
    
    try {
      setIsLoading(true);
      await login(username, password);
      toast.success('Inicio de sesión exitoso');
      navigate('/dashboard');
    } catch (error) {
      setLoginError(error.message || 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100">
      {/* Partículas flotantes */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-primary-400 rounded-full animate-float"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDelay: `${particle.id * 0.1}s`,
          }}
        />
      ))}

      {/* Fondo decorativo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-300/20 to-secondary-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-md transform transition-all duration-1000 ${
          animationComplete 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-10 scale-95'
        }`}>
          
          {/* Header con logo */}
          <div className="text-center mb-8 animate-fade-in-down">
            <div className="inline-flex items-center justify-center mb-6 transform hover:scale-105 transition-all duration-500 group">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-4 rounded-3xl shadow-2xl group-hover:shadow-primary-500/50 transition-all duration-500 group-hover:rotate-12">
                  <Package className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700 bg-clip-text text-transparent mb-3 animate-fade-in-up">
              Scaner Tecnophone
            </h1>
            <p className="text-secondary-600 text-lg font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Gestión inteligente de escaneo
            </p>
            
            {/* Badges de características */}
            <div className="flex justify-center space-x-3 mt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                <span>Seguro</span>
              </div>
              <div className="flex items-center space-x-1 px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                <span>Rápido</span>
              </div>
              <div className="flex items-center space-x-1 px-3 py-1 bg-warning-100 text-warning-700 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Inteligente</span>
              </div>
            </div>
          </div>
          
          {/* Formulario de login */}
          <div className="card-glass p-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-secondary-800 mb-2">Bienvenido de vuelta</h2>
              <p className="text-secondary-600">Ingresa tus credenciales para continuar</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {loginError && (
                <div className="p-4 bg-error-50 border border-error-200 rounded-xl text-error-700 animate-shake flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-error-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{loginError}</span>
                </div>
              )}
              
              {/* Campo de usuario */}
              <div className="space-y-2">
                <label className="block text-secondary-700 text-sm font-semibold" htmlFor="username">
                  Usuario
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-modern pl-12 pr-4 py-4 text-lg transition-all duration-300 focus:ring-4 focus:ring-primary-500/20"
                    placeholder="Ingrese su usuario"
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-focus-within:from-primary-500/5 group-focus-within:via-primary-500/10 group-focus-within:to-primary-500/5 transition-all duration-500 pointer-events-none"></div>
                </div>
              </div>
              
              {/* Campo de contraseña */}
              <div className="space-y-2">
                <label className="block text-secondary-700 text-sm font-semibold" htmlFor="password">
                  Contraseña
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-modern pl-12 pr-12 py-4 text-lg transition-all duration-300 focus:ring-4 focus:ring-primary-500/20"
                    placeholder="Ingrese su contraseña"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-focus-within:from-primary-500/5 group-focus-within:via-primary-500/10 group-focus-within:to-primary-500/5 transition-all duration-500 pointer-events-none"></div>
                </div>
              </div>
              
              {/* Botón de envío */}
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center space-x-3">
                    <div className="loader-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  <div className="flex justify-center items-center space-x-3">
                    <CheckCircle className="h-5 w-5" />
                    <span>Iniciar Sesión</span>
                  </div>
                )}
              </button>
            </form>
            
            {/* Información adicional */}
            <div className="mt-6 text-center">
              <p className="text-xs text-secondary-500">
                Al iniciar sesión, aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="text-sm text-secondary-500 space-y-1">
              <p>© {new Date().getFullYear()} Scaner Tecnophone. Todos los derechos reservados.</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
                <span className="text-primary-600 font-medium">v2.0.0</span>
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
              </div>
              
              {/* Crédito del desarrollador */}
              <div className="mt-4 pt-4 border-t border-secondary-200/50">
                <p className="text-xs text-secondary-400 mb-2">Desarrollado por</p>
                <div className="flex items-center justify-center space-x-3">
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 