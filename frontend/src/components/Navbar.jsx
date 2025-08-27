import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Scan, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Package, 
  BarChart3, 
  Settings,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const location = useLocation();

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };



  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, description: 'Panel principal' },
    { path: '/scan', label: 'Escanear', icon: Scan, description: 'Escaneo de códigos' },
    { path: '/profile', label: 'Perfil', icon: User, description: 'Configuración' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/20' 
        : 'bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo y Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
          >
            <div className={`relative p-2 rounded-2xl transition-all duration-500 group-hover:rotate-12 ${
              isScrolled 
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg' 
                : 'bg-white/20 text-white backdrop-blur-sm'
            }`}>
              <Package className="h-8 w-8" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-wider transition-colors duration-300 ${
                isScrolled ? 'text-primary-700' : 'text-white'
              }`}>
                Scaner
              </span>
              <span className={`text-sm font-medium transition-colors duration-300 ${
                isScrolled ? 'text-secondary-500' : 'text-primary-100'
              }`}>
                Tecnophone
              </span>
            </div>
          </Link>

          {/* Menú de navegación para escritorio */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActiveRoute(item.path)
                        ? isScrolled
                          ? 'bg-primary-100 text-primary-700 shadow-lg'
                          : 'bg-white/20 text-white backdrop-blur-sm shadow-lg'
                        : isScrolled
                          ? 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-secondary-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                      {item.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-secondary-900"></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Lado derecho - Usuario y acciones */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-4">

              {/* Menú de usuario */}
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isScrolled
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/30 text-primary-700'
                    }`}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{user?.username}</span>
                    <span className={`text-xs transition-colors duration-300 ${
                      isScrolled ? 'text-secondary-500' : 'text-primary-100'
                    }`}>
                      Usuario Activo
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown del usuario */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 animate-fade-in-down">
                    <div className="p-4 border-b border-secondary-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-lg">
                          {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-800">{user?.username}</p>
                          <p className="text-sm text-secondary-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-xl text-secondary-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
                      >
                        <User className="h-4 w-4" />
                        <span>Mi Perfil</span>
                      </Link>
                      
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-xl text-secondary-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      
                      <Link
                        to="/scan"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-xl text-secondary-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
                      >
                        <Scan className="h-4 w-4" />
                        <span>Escanear</span>
                      </Link>
                      
                      <div className="border-t border-secondary-100 my-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl bg-red-100 text-red-700 transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botón de menú móvil */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                isScrolled
                  ? 'bg-primary-50 text-primary-600 hover:text-primary-700 hover:bg-primary-100 border border-primary-200'
                  : 'text-white !text-white hover:text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? (
                <X className={`h-6 w-6 ${!isScrolled ? 'text-white' : ''}`} />
              ) : (
                <Menu className={`h-6 w-6 ${!isScrolled ? 'text-white' : ''}`} />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isAuthenticated && isMenuOpen && (
          <div className="lg:hidden mt-4 animate-fade-in-down">
            <div className={`p-4 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
              isScrolled
                ? 'bg-white/90 border-secondary-200'
                : 'bg-white/20 border-white/20'
            }`}>
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActiveRoute(item.path)
                          ? isScrolled
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-white/20 text-white'
                          : isScrolled
                            ? 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                
                <div className="border-t border-secondary-200 my-3"></div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-red-100 text-red-700 transition-all duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Indicador de progreso */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-0 animate-pulse"></div>
    </nav>
  );
};

export default Navbar; 