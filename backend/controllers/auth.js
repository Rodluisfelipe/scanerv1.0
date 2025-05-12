const User = require('../models/User');
const nodemailer = require('nodemailer');

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validar inputs
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Por favor proporcione un nombre de usuario y contraseña'
      });
    }

    // Verificar que el usuario existe
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Comprobar si la contraseña coincide
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Por favor proporcione la contraseña actual y la nueva'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Verificar contraseña actual
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Contraseña actual incorrecta'
      });
    }

    // Establecer nueva contraseña
    user.password = newPassword;
    await user.save();

    // Enviar email de confirmación
    await sendPasswordChangeEmail(user.email);

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
};

// Función para generar token y enviar respuesta
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE.replace(/\D/g, '') * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // Seguridad en producción
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

// Función para enviar email de cambio de contraseña
const sendPasswordChangeEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const message = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Cambio de contraseña - Sistema de Escaneo',
      text: `Su contraseña ha sido cambiada con éxito. Si no realizó este cambio, por favor contacte al administrador.`
    };

    await transporter.sendMail(message);
  } catch (error) {
    console.error('Error al enviar email:', error);
  }
}; 