const jwt = require('jsonwebtoken');
const usersController = require('./usersController'); // Importa el usersController
const pool = require('../database/db');
const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
  // Login
  login: async (req, res) => {
    const { dni, password } = req.body;

    try {
      const usuario = await usersController.getUserAndValidatePassword(dni, password);

      // Crear token JWT
      const token = jwt.sign({ id_usuario: usuario.id, id_rol: usuario.id_rol }, secretKey, { expiresIn: '7d' });

      // Enviar el token en una cookie HTTP-only y segura
      res.cookie('token', token, {
        httpOnly: true, // Hace que la cookie no sea accesible desde JavaScript
        secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si está en producción
        sameSite: 'Strict', // Evita que la cookie sea enviada en solicitudes entre sitios
        maxAge: 3600000 // Tiempo de expiración de la cookie en milisegundos (1 hora)
      });

      return res.json({
        success: true,
        userData: {
          id_usuario: usuario.id,
          usuario: usuario.usuario,
          id_rol: usuario.id_rol,
        },
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  },

  // Obtener datos del usuario logueado
  getUserData: async (req, res) => {
    try {
      // Obtener el token de la cookie
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ success: false, message: 'Token no encontrado' });
      }

      // Verificar el token
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.id_usuario;

      const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [userId]);

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const usuario = rows[0];
      return res.json({ success: true, user: usuario });
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },

  // Logout (Cierre de sesión)
  handleLogoutLogic: (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
  },

  // Logout (Cierre de sesión)
  logout: (req, res) => {
    module.exports.handleLogoutLogic(req, res);

    return res.json({ success: true, message: 'Sesión cerrada exitosamente' });
  }
};