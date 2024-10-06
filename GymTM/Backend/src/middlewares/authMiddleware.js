const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController'); // Asegúrate de importar tu controlador
const secretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  try {
    // Intenta leer el token de la cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Acceso no autorizado. No se encontró el token.' });
    }

    // Verificar el token
    const decoded = jwt.verify(token, secretKey);

    // Almacenar información del token en la solicitud
    req.userId = decoded.id_usuario;
    req.userRole = decoded.id_rol;

    next(); // Continuar con la siguiente función
  } catch (error) {
    console.error('Error en la autenticación:', error);

    // Diferenciar errores de JWT
    if (error.name === 'TokenExpiredError') {
      // Si el token está expirado, podemos considerar hacer logout
      await authController.handleLogoutLogic(req, res); // Cerrar sesión
      return res.status(401).json({ success: false, message: 'Acceso no autorizado. Token expirado.' });
    }

    if (error.name === 'JsonWebTokenError') {
      // Si el token es inválido, puedes hacer lo mismo o sólo retornar un mensaje
      return res.status(401).json({ success: false, message: 'Acceso no autorizado. Token inválido.' });
    }

    // Otros errores de autenticación
    return res.status(500).json({ success: false, message: 'Error de autenticación.' });
  }
};

module.exports = authMiddleware;