import { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { changePassword } from '../services/authService';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Key,
  Settings,
  Save,
  RefreshCw
} from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar datos
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await changePassword(formData.currentPassword, formData.newPassword);
      
      toast.success('Contraseña cambiada con éxito');
      
      // Limpiar formulario
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al cambiar la contraseña';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: 'bg-secondary-200', text: '' };
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { strength: score, color: 'bg-error-500', text: 'Débil' };
    if (score <= 4) return { strength: score, color: 'bg-warning-500', text: 'Media' };
    return { strength: score, color: 'bg-success-500', text: 'Fuerte' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-100">
      <Navbar />
      
      <div className="pt-20 container mx-auto px-4 py-8">
        {/* Header de la página */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center justify-center p-4 mb-6 rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-2xl">
            <User className="h-16 w-16 text-white" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700 bg-clip-text text-transparent mb-4">
            Mi Perfil
          </h1>
          
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Gestiona tu información personal y configuración de seguridad
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Información del usuario */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="card-glass p-8 h-fit">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-secondary-800 mb-2">{user?.username}</h2>
                <div className="inline-flex items-center space-x-1 px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <span>Usuario Activo</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Mail className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Email</p>
                    <p className="font-semibold text-secondary-800">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                  <div className="p-2 bg-secondary-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Cuenta creada</p>
                    <p className="font-semibold text-secondary-800">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                  <div className="p-2 bg-success-100 rounded-lg">
                    <Shield className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Estado de seguridad</p>
                    <p className="font-semibold text-success-600">Verificado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Formulario de cambio de contraseña */}
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="card-glass p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <Key className="h-6 w-6 text-warning-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800">Cambiar Contraseña</h2>
                  <p className="text-secondary-600">Actualiza tu contraseña para mantener tu cuenta segura</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-error-50 border border-error-200 rounded-xl text-error-700 animate-shake flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-error-500 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}
                
                {/* Contraseña actual */}
                <div className="space-y-2">
                  <label className="block text-secondary-700 text-sm font-semibold" htmlFor="currentPassword">
                    Contraseña Actual
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                    </div>
                    <input
                      id="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="input-modern pl-12 pr-12 py-4 text-lg"
                      placeholder="Ingrese su contraseña actual"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Nueva contraseña */}
                <div className="space-y-2">
                  <label className="block text-secondary-700 text-sm font-semibold" htmlFor="newPassword">
                    Nueva Contraseña
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                    </div>
                    <input
                      id="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="input-modern pl-12 pr-12 py-4 text-lg"
                      placeholder="Ingrese su nueva contraseña"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Indicador de fortaleza de contraseña */}
                  {formData.newPassword && (
                    <div className="mt-3 animate-fade-in-up">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-secondary-600">Fortaleza de la contraseña:</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          passwordStrength.strength <= 2 ? 'bg-error-100 text-error-700' :
                          passwordStrength.strength <= 4 ? 'bg-warning-100 text-warning-700' :
                          'bg-success-100 text-success-700'
                        }`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Confirmar nueva contraseña */}
                <div className="space-y-2">
                  <label className="block text-secondary-700 text-sm font-semibold" htmlFor="confirmPassword">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CheckCircle className="h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-modern pl-12 pr-12 py-4 text-lg"
                      placeholder="Confirme su nueva contraseña"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Indicador de coincidencia */}
                  {formData.confirmPassword && (
                    <div className="mt-2 animate-fade-in-up">
                      <div className={`flex items-center space-x-2 text-sm ${
                        formData.newPassword === formData.confirmPassword 
                          ? 'text-success-600' 
                          : 'text-error-600'
                      }`}>
                        {formData.newPassword === formData.confirmPassword ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <span>
                          {formData.newPassword === formData.confirmPassword 
                            ? 'Las contraseñas coinciden' 
                            : 'Las contraseñas no coinciden'
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Botón de envío */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2 px-8 py-4 text-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>Cambiar Contraseña</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Footer de la página */}
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/20">
            <Sparkles className="h-5 w-5 text-primary-500" />
            <span className="text-sm text-secondary-600">
              Tu seguridad es nuestra prioridad
            </span>
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

export default ProfilePage; 