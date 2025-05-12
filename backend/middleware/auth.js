const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rutas
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Obtener token del header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    // Obtener token de cookies
    token = req.cookies.token;
  }

  // Verificar que el token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No está autorizado para acceder a esta ruta'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'No está autorizado para acceder a esta ruta'
    });
  }
}; 